import CRUDButtonGroup from "./CRUDButtonGroup";

export default function CRUDModal() {
  return (
    <div
      className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      role="region"
      aria-labelledby="modalTitle"
    >
      <h2 id="modalTitle" className="text-xl font-bold text-gray-900 sm:text-2xl">
        Creative Suite
      </h2>

      <div className="mt-4">
        <CRUDButtonGroup></CRUDButtonGroup>
      </div>
    </div>
  );
}
