// One styled form field (label + input/textarea) used by every form.
//   variant="default" -> compact fields inside modals
//   variant="auth"    -> large fields on the login / signup pages
//   as="textarea"     -> renders a <textarea>
//   startAdornment / endAdornment -> something drawn inside the field (a "$", a button...)

const VARIANTS = {
  default: {
    wrapper: "mt-1.5",
    field:
      "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
  },
  auth: {
    wrapper: "mt-2",
    field:
      "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10",
  },
};

export default function Input({
  label,
  as: Component = "input",
  variant = "default",
  hint,
  startAdornment,
  endAdornment,
  className = "",
  ...props
}) {
  const styles = VARIANTS[variant];
  const padding = `${startAdornment ? "pl-7" : ""} ${endAdornment ? "pr-12" : ""}`;

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className={`relative block ${styles.wrapper}`}>
        {startAdornment && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {startAdornment}
          </span>
        )}
        <Component className={`${styles.field} ${padding} ${className}`} {...props} />
        {endAdornment}
      </span>
      {hint && (
        <span className="mt-2 block text-xs font-normal text-slate-500">{hint}</span>
      )}
    </label>
  );
}
