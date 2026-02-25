export default function ProfileCard({
  name,
  bio = "No bio provided.",
  photo = null,
  bgColor = "#1e1e2e",
  textColor = "#ffffff",
  accentColor = "#646cff",
  width = "220px",
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: width,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      }}
    >
      {/* Photo Section */}
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: accentColor + "33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div style={{ padding: "1.2rem" }}>
        <h3
          style={{
            margin: "0 0 0.8rem 0",
            fontSize: "1.1rem",
            fontWeight: "700",
            color: textColor,
          }}
        >
          {name}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            lineHeight: "1.5",
            color: textColor + "bb",
          }}
        >
          {bio}
        </p>
      </div>
    </div>
  );
}