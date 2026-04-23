import { useState } from "react";
import CRUDModal from "../components/CRUDModal";
import Selector from "../components/selector";

export default function CreativeSuite() {
  const [selectedType, setSelectedType] = useState("C");

  const resourceLabel =
    {
      C: "City",
      CNTRY: "Country",
      S: "State",
    }[selectedType] || "Resource";

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="w-full rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-5 py-4">
            <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Creative Suite
            </span>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Manage {resourceLabel.toLowerCase()} records
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Pick a resource type, then use the actions below to create,
                edit, delete, or list records.
              </p>
            </div>
          </div>

          <Selector
            label="Resource"
            name="resourceType"
            id="resourceType"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="mb-4"
            options={[
              { value: "C", label: "City" },
              { value: "CNTRY", label: "Country" },
              { value: "S", label: "State" },
            ]}
          />

          <CRUDModal entityType={selectedType} />
        </div>
      </div>
    </div>
  );
}
