import CRUDButtonGroup from "./CRUDButtonGroup";

const entityLabels = {
  C: "City",
  CNTRY: "Country",
  S: "State",
};

export default function CRUDModal({ entityType = "C" }) {
  const entityLabel = entityLabels[entityType] || "Item";

  return (
    <div
      className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 text-white shadow-xl shadow-cyan-950/20 sm:p-6"
      role="region"
      aria-labelledby="modalTitle"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Active panel
        </p>
        <h2 id="modalTitle" className="mt-2 text-xl font-bold sm:text-2xl">
          {entityLabel} manager
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Use the tabs below to work with {entityLabel.toLowerCase()} records.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
        <CRUDButtonGroup entityType={entityType} />
      </div>
    </div>
  );
}
