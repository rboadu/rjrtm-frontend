import ProfileCard from "../components/profile_card";
import ContactUs from "../components/ContactUs";
import JadenHeadshot from "../images/Jaden_headshot.jpeg";
import RebeccaHeadshot from "../images/Profile.png";
import TerraHeadshot from "../images/terra.png";
import rikuHeadshot from "../images/riku_headshot.png";
import MikiyasHeadshot from "../images/miki_headshot.jpeg";

const teamMembers = [
  {
    name: "Rebecca Boadu",
    bio: "A computer science major passionate about exploring the depths of software development and thoughtful design. ",
    accentColor: "#000dfe",
    photo: RebeccaHeadshot,
  },
  {
    name: "Jaden Ritchie",
    bio: "A computer science major interested in software development and the nicher fields of SRE and Networking",
    accentColor: "#000dfe",
    photo: JadenHeadshot,
  },
  {
    name: "Riku Santa Cruz",
    bio: "A computer science major interested in software development",
    accentColor: "#000dfe",
    photo: rikuHeadshot,
  },
  {
    name: "Terra Nagai",
    bio: "A student-athlete majoring in computer science interested in the intersection of AI and sports, and passionate about using technology to enhance athletic performance and fan engagement.",
    accentColor: "#000dfe",
    photo: TerraHeadshot,
  },
  {
    name: "Mikiyas Legesse",
    bio: "Graduating computer science student interested in software development, with a focus on backend engineering and AI-driven systems",
    accentColor: "#000dfe",
    photo: MikiyasHeadshot,
  },
];

export default function Team() {
  const row1 = teamMembers.slice(0, 3);
  const row2 = teamMembers.slice(3);
  return (
    <div
      className="min-h-screen bg-[#232b36]"
      style={{
        padding: "5rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>Senior Design Team</h1>
      <p style={{ marginBottom: "3rem", color: "#999" }}>
        This is the RJRTM team.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
        }}
      >
        {row1.map((member) => (
          <ProfileCard
            key={member.name}
            name={member.name}
            bio={member.bio}
            photo={member.photo}
            accentColor={member.accentColor}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        {row2.map((member) => (
          <ProfileCard
            key={member.name}
            name={member.name}
            bio={member.bio}
            photo={member.photo}
            accentColor={member.accentColor}
          />
        ))}
      </div>
      <ContactUs />
    </div>
  );
}
