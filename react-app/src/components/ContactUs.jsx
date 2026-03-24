import React, { useEffect, useState } from "react";

export default function ContactUs() {
  const STORAGE_KEY_DRAFT = "contactFormDraft";
  const STORAGE_KEY_SUBMISSIONS = "contactFormSubmissions";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // null | "saved" | "error"
  const [error, setError] = useState("");

  // load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFT);
      if (saved) setForm(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  // update draft in localStorage whenever form changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
    setError("");
  }

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.message.trim()) return "Please enter a message.";
    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }

    try {
      // store submission in localStorage (keeps history)
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || "[]");
      const submission = { ...form, submittedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify([submission, ...existing]));

      // keep draft in place (so it doesn't disappear). If you prefer to clear the form, setForm({ name:"", email:"", message:"" }) here.
      setStatus("saved");
      setError("");
    } catch {
      setError("Could not save your message locally.");
      setStatus("error");
    }
  }

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
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Your name"
          style={{ padding: "0.75rem" }}
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          placeholder="Your email"
          style={{ padding: "0.75rem" }}
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
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

      <div style={{ marginTop: "1rem", minHeight: "1.5rem" }}>
        {status === "saved" && (
          <div style={{ color: "green" }}>
            Thank you! Your message has been saved.
          </div>
        )}
        {status === "error" && error && (
          <div style={{ color: "crimson" }}>{error}</div>
        )}
      </div>
    </div>
  );
}