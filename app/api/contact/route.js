const inquiryTypes = new Set(["collaboration", "production", "business", "general"]);

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, inquiryType, message, company } = body ?? {};

  // Honeypot: a hidden field real users never fill in. Bots that autofill every
  // field trip this and get a fake success response, no error to learn from.
  if (company) {
    return Response.json({ ok: true });
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (typeof inquiryType !== "string" || !inquiryTypes.has(inquiryType)) {
    return Response.json({ error: "Please select an inquiry type." }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    return Response.json({ error: "Message must be at least 10 characters." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactInbox = process.env.CONTACT_INBOX_EMAIL;

  if (resendApiKey && contactInbox) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HalfCodeMusic <contact@halfcodemusic.com>",
        to: [contactInbox],
        reply_to: email,
        subject: `[${inquiryType}] New message from ${name}`,
        text: message,
      }),
    });

    if (!res.ok) {
      return Response.json({ error: "Message could not be sent. Please try again." }, { status: 502 });
    }
  } else {
    // No email provider configured yet — log server-side so the message isn't
    // lost during local development. Set RESEND_API_KEY + CONTACT_INBOX_EMAIL
    // in the environment to actually deliver messages.
    console.info("[contact] message received (no email provider configured):", {
      name,
      email,
      inquiryType,
      message,
    });
  }

  return Response.json({ ok: true });
}
