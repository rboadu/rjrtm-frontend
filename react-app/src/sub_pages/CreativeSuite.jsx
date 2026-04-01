import { useState } from "react";
import CRUDModal from "../components/CRUDModal";
import Selector from "../components/selector";

export default function CreativeSuite() {
  const [selectedType, setSelectedType] = useState("C");

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
        <h1 className="mb-4 text-3xl font-bold">Creative Suite</h1>

        <Selector
          label="Choose resource"
          name="resourceType"
          id="resourceType"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="mb-6"
          options={[
            { value: "C", label: "City" },
            { value: "CNTRY", label: "Country" },
            { value: "S", label: "State" },
          ]}
        />

        <CRUDModal entityType={selectedType} />
      </div>
    </div>
  );
}
