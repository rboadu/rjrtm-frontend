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
    { name: "country", label: "Country", required: false },
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
  const [formValues, setFormValues] = useState(() =>
    createEmptyValues(createFields[entityType] || createFields.C),
  );
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = createFields[entityType] || createFields.C;

  useEffect(() => {
    setFormValues(createEmptyValues(fields));
    setStatus("");
  }, [entityType]);

  const handleFieldChange = (name, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    const missingField = fields.find(
      (field) => field.required && !String(formValues[field.name] ?? "").trim(),
    );

    if (missingField) {
      setStatus(`${missingField.label} is required.`);
      return;
    }

    const endpoint = createEndpoints[entityType] || createEndpoints.C;
    const payload = fields.reduce((values, field) => {
      const rawValue = String(formValues[field.name] ?? "").trim();

      if (!rawValue) {
        return values;
      }

      values[field.name] =
        field.type === "number" ? Number(rawValue) : rawValue;
      return values;
    }, {});

    setIsSubmitting(true);
    setStatus("Submitting...");
    console.log(buildUrl(endpoint));
    try {
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

      setStatus(`${entityLabels[entityType] || "Item"} created successfully.`);
      setFormValues(createEmptyValues(fields));
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
                  value={formValues[field.name] || ""}
                  onChange={(event) =>
                    handleFieldChange(field.name, event.target.value)
                  }
                  required={field.required}
                  className="rounded border border-gray-300 px-2 py-1 shadow-sm"
                  placeholder={field.label}
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </label>
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
              placeholder="Item ID to edit..."
              style={{ backgroundColor: "white", color: "black" }}
            />
            <input
              className="border px-2 py-1"
              placeholder="New value..."
              style={{ backgroundColor: "white", color: "black" }}
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded">
              Update
            </button>
          </div>
        );
      case "Delete":
        return (
          <div className="mt-4 flex flex-col gap-2">
            <input
              className="border px-2 py-1"
              placeholder="Item ID to delete..."
              style={{ backgroundColor: "white", color: "black" }}
            />
            <button className="bg-red-600 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
        );
      case "List":
        return (
          <div className="mt-4 text-gray-700 dark:text-gray-200">
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
