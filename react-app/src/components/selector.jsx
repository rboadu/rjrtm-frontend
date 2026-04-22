export default function Selector({
  label = "Headliner",
  name = "Headline",
  id = "Headline",
  value,
  onChange,
  className = "",
  options = [
    { value: "", label: "Please select" },
    { value: "C", label: "City" },
    { value: "CNTRY", label: "Country" },
    { value: "S", label: "State" },
  ],
  ...props
}) {
  return (
    <label htmlFor={id} className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
        {label}
      </span>

      <div className="relative mt-2">
        <select
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-11 text-sm text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/30"
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ color: "black", backgroundColor: "white" }}
            >
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400"
        >
          ▾
        </span>
      </div>
    </label>
  );
}
