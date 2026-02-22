export function Button({
  children = "Download",
  href = "#",
  className = "",
  ...props
}) {
  return (
    <a
      className={`group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5 hover:text-white ${className}`}
      href={href}
      {...props}
    >
      <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
        {children}
      </span>
    </a>
  );
}
