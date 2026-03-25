import CRUDButtonGroup from "./CRUDButtonGroup";

export default function CRUDModal() {
  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2
          id="modalTitle"
          className="text-xl font-bold text-gray-900 sm:text-2xl"
        >
          Creative Suite
        </h2>

        <div className="mt-4">
          <CRUDButtonGroup></CRUDButtonGroup>
        </div>
      </div>
    </div>
  );
}
