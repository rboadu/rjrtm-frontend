import CRUDModal from "../components/CRUDModal";

export default function CreativeSuite() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center w-full">
      <h1 className="text-3xl font-bold mb-4">Creative Suite</h1>
      <CRUDModal></CRUDModal>
    </div>
  );
}
