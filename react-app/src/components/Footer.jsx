export default function Footer() {
  return (
    <footer className="bg-gray-800/50 text-gray-400 text-sm w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold text-white">RJRTM</span>
        <span>NYU Senior Design Project &copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
