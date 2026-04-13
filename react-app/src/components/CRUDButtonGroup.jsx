import { useEffect, useState } from "react";
import { API_BASE } from "../config";

const entityLabels = {
  C: "City",
  CNTRY: "Country",
  S: "State",
};

const createFields = {
  C: [
    { name: "name", label: "Name", required: true },
    { name: "country", label: "Country", required: true },
    {
      name: "population",
      label: "Population",
      required: false,
      type: "number",
    },
  ],
  CNTRY: [
    { name: "code", label: "Code", required: true },
    { name: "name", label: "Name", required: true },
  ],
  S: [
    { name: "code", label: "Code", required: true },
    { name: "name", label: "Name", required: true },
    { name: "country", label: "Country", required: true },
  ],
};

const createEndpoints = {
  C: "/cities",
  S: "/states",
  CNTRY: "/countries/",
};

const bulkCreateEndpoints = {
  C: "/cities/bulk",
  S: "/states/bulk",
};

function createEmptyValues(fields) {
  return fields.reduce((values, field) => {
    values[field.name] = "";
    return values;
  }, {});
}

function buildUrl(path) {
  const base = ("http://127.0.0.1:8000/" || "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export default function CRUDButtonGroup({ entityType = "C" }) {
  const [active, setActive] = useState(null);
  const [createRows, setCreateRows] = useState(() => [
    createEmptyValues(createFields[entityType] || createFields.C),
  ]);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Edit state hooks (must be top-level)
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPopulation, setEditPopulation] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const fields = createFields[entityType] || createFields.C;

  useEffect(() => {
    setCreateRows([createEmptyValues(fields)]);
    setStatus("");
  }, [entityType]);

  const isBulkCreateEnabled = entityType === "C" || entityType === "S";

  const handleFieldChange = (rowIndex, name, value) => {
    setCreateRows((currentRows) =>
      currentRows.map((row, index) =>
        index === rowIndex ? { ...row, [name]: value } : row,
      ),
    );
  };

  const handleAddRow = () => {
    setCreateRows((currentRows) => [...currentRows, createEmptyValues(fields)]);
  };

  const handleRemoveRow = (rowIndex) => {
    setCreateRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows;
      }

      return currentRows.filter((_, index) => index !== rowIndex);
    });
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("Submitting...");
    try {
      const endpoint = isBulkCreateEnabled
        ? bulkCreateEndpoints[entityType] || createEndpoints.C
        : createEndpoints[entityType] || createEndpoints.C;

      const payloadRows = createRows.map((row, rowIndex) => {
        const missingField = fields.find(
          (field) => field.required && !String(row[field.name] ?? "").trim(),
        );

        if (missingField) {
          throw new Error(
            `Row ${rowIndex + 1}: ${missingField.label} is required.`,
          );
        }

        return fields.reduce((values, field) => {
          const rawValue = String(row[field.name] ?? "").trim();

          if (!rawValue) {
            return values;
          }

          values[field.name] =
            field.type === "number" ? Number(rawValue) : rawValue;
          return values;
        }, {});
      });

      const payload = isBulkCreateEnabled ? payloadRows : payloadRows[0] || {};
      const response = await fetch(buildUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const responseBody = responseText ? responseText : "";

      if (!response.ok) {
        throw new Error(
          responseBody || `${response.status} ${response.statusText}`,
        );
      }

      setStatus(
        isBulkCreateEnabled
          ? `${entityLabels[entityType] || "Item"}s created successfully.`
          : `${entityLabels[entityType] || "Item"} created successfully.`,
      );
      setCreateRows([createEmptyValues(fields)]);
    } catch (error) {
      setStatus(`Create failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [listData, setListData] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const handleList = async () => {
    setIsLoadingList(true);
    setListData([]);
    try {
      const endpoint = createEndpoints[entityType] || createEndpoints.C;
      const response = await fetch(buildUrl(endpoint), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`);
      const data = await response.json();
      setListData(Array.isArray(data) ? data : []);
    } catch (err) {
      setListData([]);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (active === "List") {
      handleList();
    }
  }, [active, entityType]);

  const renderInputs = () => {
    switch (active) {
      case "Create":
        return (
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={handleCreateSubmit}
          >
            <div className="text-sm font-medium text-gray-700">
              Create {entityLabels[entityType] || "Item"}
            </div>

            {createRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="rounded border border-gray-200 p-3"
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {isBulkCreateEnabled ? `Entry ${rowIndex + 1}` : "Details"}
                </div>

                <div className="flex flex-col gap-3">
                  {fields.map((field) => (
                    <label
                      key={field.name}
                      className="flex flex-col gap-1 text-sm font-medium text-gray-700"
                    >
                      <span>
                        {field.label}
                        {!field.required ? " (optional)" : ""}
                      </span>
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        value={row[field.name] || ""}
                        onChange={(event) =>
                          handleFieldChange(
                            rowIndex,
                            field.name,
                            event.target.value,
                          )
                        }
                        required={field.required}
                        className="rounded border border-gray-300 px-2 py-1 shadow-sm"
                        placeholder={field.label}
                        style={{ backgroundColor: "white", color: "black" }}
                      />
                    </label>
                  ))}
                </div>

                {isBulkCreateEnabled ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={handleAddRow}
                    >
                      Add another
                    </button>
                    {createRows.length > 1 ? (
                      <button
                        type="button"
                        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveRow(rowIndex)}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}

            <button
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            {status ? (
              <p className="text-sm text-gray-600" aria-live="polite">
                {status}
              </p>
            ) : null}
          </form>
        );
      case "Edit":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input
              className="border px-2 py-1"
              placeholder={
                entityType === "C"
                  ? "City name to update..."
                  : "Item ID to update..."
              }
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{ backgroundColor: "white", color: "black" }}
            />
            {entityType === "C" && (
              <>
                <input
                  className="border px-2 py-1"
                  placeholder="Country"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                />
                <input
                  className="border px-2 py-1"
                  placeholder="Population (optional)"
                  type="number"
                  value={editPopulation}
                  onChange={(e) => setEditPopulation(e.target.value)}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </>
            )}
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={async () => {
                setEditStatus("");
                if (!editName.trim()) {
                  setEditStatus("Please enter a name to update.");
                  return;
                }
                if (entityType === "C" && !editCountry.trim()) {
                  setEditStatus("Please enter a country.");
                  return;
                }
                try {
                  let endpoint, payload;
                  if (entityType === "C") {
                    endpoint = `/cities/${encodeURIComponent(editName.trim())}`;
                    payload = {
                      name: editName.trim(),
                      country: editCountry.trim(),
                    };
                    if (editPopulation.trim()) {
                      payload.population = Number(editPopulation.trim());
                    }
                  } else {
                    setEditStatus("Update only implemented for cities.");
                    return;
                  }
                  const response = await fetch(buildUrl(endpoint), {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });
                  if (response.ok) {
                    setEditStatus(
                      `${entityLabels[entityType] || "Item"} updated successfully.`,
                    );
                    setEditName("");
                    setEditCountry("");
                    setEditPopulation("");
                  } else {
                    const data = await response.json().catch(() => ({}));
                    setEditStatus(
                      data.error ||
                        `Update failed: ${response.status} ${response.statusText}`,
                    );
                  }
                } catch (err) {
                  setEditStatus(`Update failed: ${err.message}`);
                }
              }}
            >
              Update
            </button>
            {editStatus && (
              <p className="text-sm text-gray-600" aria-live="polite">
                {editStatus}
              </p>
            )}
          </div>
        );
      case "Delete":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input
              className="border px-2 py-1"
              placeholder={
                entityType === "C"
                  ? "City name to delete..."
                  : "Item ID to delete..."
              }
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              style={{ backgroundColor: "white", color: "black" }}
            />
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={async () => {
                setDeleteStatus("");
                if (!deleteInput.trim()) {
                  setDeleteStatus("Please enter a name to delete.");
                  return;
                }
                try {
                  let endpoint;
                  if (entityType === "C") {
                    endpoint = `/cities/${encodeURIComponent(deleteInput.trim())}`;
                  } else if (entityType === "S") {
                    endpoint = `/states/${encodeURIComponent(deleteInput.trim())}`;
                  } else if (entityType === "CNTRY") {
                    endpoint = `/countries/${encodeURIComponent(deleteInput.trim())}`;
                  } else {
                    setDeleteStatus("Unknown entity type.");
                    return;
                  }
                  const response = await fetch(buildUrl(endpoint), {
                    method: "DELETE",
                  });
                  if (response.ok) {
                    setDeleteStatus(
                      `${entityLabels[entityType] || "Item"} deleted successfully.`,
                    );
                    setDeleteInput("");
                  } else {
                    const data = await response.json().catch(() => ({}));
                    setDeleteStatus(
                      data.error ||
                        `Delete failed: ${response.status} ${response.statusText}`,
                    );
                  }
                } catch (err) {
                  setDeleteStatus(`Delete failed: ${err.message}`);
                }
              }}
            >
              Delete
            </button>
            {deleteStatus && (
              <p className="text-sm text-gray-600" aria-live="polite">
                {deleteStatus}
              </p>
            )}
          </div>
        );
      case "List":
        return (
          <div className="mt-4 text-gray-700 dark:text-black">
            {isLoadingList ? (
              <div>Loading...</div>
            ) : listData.length === 0 ? (
              <div>No items found.</div>
            ) : (
              <ul className="list-disc pl-5">
                {listData.map((item, idx) => (
                  <li key={item.id || item.code || item.name || idx}>
                    {Object.entries(item)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
