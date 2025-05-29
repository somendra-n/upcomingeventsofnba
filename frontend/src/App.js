import React, { useEffect, useState } from "react";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/upcoming-matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setLoading(false);
      });
  }, []);

 return (
  <div
    style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(to bottom, #0b2545, #1d3557)",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#fff",
      overflowY: "auto",
    }}
  >
    <header
      style={{
        textAlign: "center",
        padding: "40px 20px 20px",
        backgroundColor: "#0b2545",
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
      }}
    >
      <h1
        style={{
          fontWeight: 900,
          fontSize: "2.75rem",
          letterSpacing: "0.1em",
          marginBottom: 10,
          textTransform: "uppercase",
          color: "#f58426",
          textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
        }}
      >
        Upcoming NBA Matches
      </h1>
      <p
        style={{
          fontWeight: 400,
          fontSize: "1.1rem",
          color: "#b0bec5",
          marginTop: 0,
        }}
      >
        Stay up to date with the latest scheduled games.
      </p>
    </header>

    <main
      style={{
        flex: 1,
        maxWidth: 960,
        margin: "0 auto",
        padding: "20px",
        width: "100%",
      }}
    >
      {loading ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#90a4ae" }}>
          Loading matches...
        </p>
      ) : matches.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#90a4ae" }}>
          No upcoming matches found.
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {matches.map((match) => (
            <li
              key={match.game_id}
              style={{
                backgroundColor: "#142d4c",
                borderRadius: 12,
                padding: 20,
                display: "flex",
                alignItems: "center",
                boxShadow: "0 6px 14px rgba(0,0,0,0.5)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* Team 1 Badge */}
              <div
                style={{
                  flex: "0 0 70px",
                  height: 70,
                  backgroundColor: "#263c6c",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#f58426",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  marginRight: 20,
                  userSelect: "none",
                }}
                title={match.team1}
              >
                {match.team1
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </div>

              {/* Match Details */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#fff",
                    marginBottom: 6,
                  }}
                >
                  <span>{match.team1}</span>
                  <span
                    style={{
                      color: "#f58426",
                      fontWeight: 900,
                      margin: "0 12px",
                    }}
                  >
                    VS
                  </span>
                  <span>{match.team2}</span>
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#90a4ae",
                    fontWeight: 500,
                  }}
                >
                  {new Date(match.start_datetime).toLocaleString(undefined, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </div>
              </div>

              {/* Team 2 Badge */}
              <div
                style={{
                  flex: "0 0 70px",
                  height: 70,
                  backgroundColor: "#263c6c",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#f58426",
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  marginLeft: 20,
                  userSelect: "none",
                }}
                title={match.team2}
              >
                {match.team2
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  </div>
);
}

export default App;
