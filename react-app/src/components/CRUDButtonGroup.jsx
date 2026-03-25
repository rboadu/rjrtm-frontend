import { useState } from "react";

export default function CRUDButtonGroup() {
  const [active, setActive] = useState(null);

  const renderInputs = () => {
    switch (active) {
      case "Create":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input className="border px-2 py-1" placeholder="Enter new item..." />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
          </div>
        );
      case "Edit":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input className="border px-2 py-1" placeholder="Item ID to edit..." />
            <input className="border px-2 py-1" placeholder="New value..." />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Update</button>
          </div>
        );
      case "Delete":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input className="border px-2 py-1" placeholder="Item ID to delete..." />
            <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
          </div>
        );
      case "List":
        return (
          <div className="mt-4 text-gray-700 dark:text-gray-200">Listing items...</div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="inline-flex">
        <button
          className="rounded-s-sm border border-gray-200 px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          onClick={() => setActive("Create")}
        >
          Create
        </button>
        <button
          className="-ms-px border border-gray-200 px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          onClick={() => setActive("Edit")}
        >
          Edit
        </button>
        <button
          className="-ms-px border border-gray-200 px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          onClick={() => setActive("Delete")}
        >
          Delete
        </button>
        <button
          className="-ms-px rounded-e-sm border border-gray-200 px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50"
          onClick={() => setActive("List")}
        >
          List
        </button>
      </div>
      {renderInputs()}
    </div>
  );
}
