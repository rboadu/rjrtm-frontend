export default function ContactUs() {
  return (
    <div
      style={{
        marginTop: "5rem",
        padding: "3rem",
        maxWidth: "700px",
        width: "100%",
        borderTop: "1px solid #eee",
        textAlign: "center",
      }}
    >
      <h2>Contact Us</h2>
      <p style={{ color: "#777", marginBottom: "2rem" }}>
        Have questions or want to reach out to the team?
      </p>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Your name"
          style={{ padding: "0.75rem" }}
        />
        <input
          type="email"
          placeholder="Your email"
          style={{ padding: "0.75rem" }}
        />
        <textarea
          placeholder="Your message"
          rows={4}
          style={{ padding: "0.75rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            backgroundColor: "#000dfe",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}