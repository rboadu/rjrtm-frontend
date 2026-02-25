export default function Team() {
  const teamMembers = [
    "Rebecca Boadu",
    "Jaden Ritchie",
    "Riku Santa Cruz",
    "Terra Nagai",
    "Mikiyas Legesse"
  ];

  return (
    <div style={{ padding: "5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: "3rem" }}>Team RJRTM</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
        {teamMembers.map((name) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                width: "200px",
                height: "200px",
                backgroundColor: "#e0e0e0",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999"
              }}
            >
              Headshot
            </div>
            <h3>{name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}