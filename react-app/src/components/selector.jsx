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
      <span className="text-sm font-medium text-gray-700"> {label} </span>

      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
        style={{ color: "black", backgroundColor: "white" }}
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
    </label>
  );
}
