"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, TriangleAlert } from "lucide-react";

const inquiryOptions = [
  { value: "collaboration", label: "Music Collaboration" },
  { value: "production", label: "Production Inquiry" },
  { value: "business", label: "Business Inquiry" },
  { value: "general", label: "General Message" },
];

const initialState = { name: "", email: "", inquiryType: "collaboration", message: "", company: "" };

export default function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(initialState);
    } catch {
      setError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-3xl px-8 py-14 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="font-display text-lg font-semibold text-ink">Message sent</p>
        <p className="text-sm text-dim">Thanks for reaching out — I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-violet-700 transition-colors hover:text-violet-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-5 rounded-3xl px-6 py-8 sm:px-8 sm:py-10" noValidate>
      {/* Honeypot — hidden from real users, invisible to screen readers, catches bots that autofill every field */}
      <input
        type="text"
        name="company"
        value={values.company}
        onChange={update("company")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-semibold tracking-wide text-ink/70 uppercase">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            value={values.name}
            onChange={update("name")}
            className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-violet-500/50 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold tracking-wide text-ink/70 uppercase">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-violet-500/50 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inquiryType" className="mb-2 block text-xs font-semibold tracking-wide text-ink/70 uppercase">
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          value={values.inquiryType}
          onChange={update("inquiryType")}
          className="w-full rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink focus:border-violet-500/50 focus:outline-none"
        >
          {inquiryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs font-semibold tracking-wide text-ink/70 uppercase">
          Message
        </label>
        <textarea
          id="message"
          required
          minLength={10}
          rows={5}
          value={values.message}
          onChange={update("message")}
          className="w-full resize-none rounded-xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:border-violet-500/50 focus:outline-none"
          placeholder="Tell me a little about what you have in mind..."
        />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-600">
          <TriangleAlert className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_36px_rgba(139,92,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_56px_rgba(139,92,246,0.65)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
