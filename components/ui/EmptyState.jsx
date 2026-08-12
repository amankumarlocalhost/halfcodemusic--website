/** Shown wherever a content list is genuinely empty — never faked to fill space. */
export default function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="glass mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl px-8 py-14 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 text-ink/40">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {body && <p className="text-sm text-dim">{body}</p>}
    </div>
  );
}
