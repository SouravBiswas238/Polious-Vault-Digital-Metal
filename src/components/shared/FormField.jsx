export default function FormField({ icon: Icon, label, trailing, onChange, required, error, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className={`flex items-center gap-2 rounded-md border bg-background px-3 focus-within:border-gold ${
        error ? "border-red-500" : "border-border"
      }`}>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          {...rest}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-sm focus:outline-none"
        />
        {trailing}
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-red-500 font-medium uppercase tracking-tight">{error}</p>
      )}
    </label>
  );
}
