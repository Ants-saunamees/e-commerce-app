import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loggedIn = localStorage.getItem("logged_in") === "true";

  // Redirect if not logged in
  useEffect(() => {
    if (!loggedIn) navigate("/login");
  }, [loggedIn, navigate]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("http://localhost:8000/auth/profile", {
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok) {
          setErrorMsg(json.detail || json.error || "Failed to load profile");
          return;
        }

        setUser(json);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    try {
      await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    localStorage.removeItem("logged_in");
    localStorage.removeItem("user_email");

    navigate("/");
  }

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1e2f, #2a2a40);
          color: white;
          font-family: Inter, sans-serif;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .glass-card {
          width: 100%;
          max-width: 500px;
          padding: 32px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          margin-bottom: 40px;
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .info {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .logout-btn {
          margin-top: 20px;
          padding: 12px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff4d4d, #ff3333);
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .back-btn {
          margin-top: 12px;
          padding: 12px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4d79ff, #3366ff);
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        /* COOL ROTATING CUBE */
        .cube-container {
          width: 150px;
          height: 150px;
          perspective: 600px;
          margin-bottom: 40px;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 6s linear infinite;
        }

        .cube-face {
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
        }

        .front  { transform: translateZ(75px); }
        .back   { transform: rotateY(180deg) translateZ(75px); }
        .right  { transform: rotateY(90deg) translateZ(75px); }
        .left   { transform: rotateY(-90deg) translateZ(75px); }
        .top    { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }

        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to   { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>

      {/* COOL ROTATING CUBE */}
      <div className="cube-container">
        <div className="cube">
          <div className="cube-face front">👤</div>
          <div className="cube-face back">⚡</div>
          <div className="cube-face right">🔥</div>
          <div className="cube-face left">💎</div>
          <div className="cube-face top">⭐</div>
          <div className="cube-face bottom">🚀</div>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="glass-card">
        <div className="title">Your Profile</div>

        {errorMsg && <div className="info" style={{ color: "red" }}>{errorMsg}</div>}

        {user && (
          <>
            <div className="info"><strong>ID:</strong> {user.id}</div>
            <div className="info"><strong>Email:</strong> {user.email}</div>
            <div className="info"><strong>Is_active:</strong> {user.is_active.toString()}</div>
            <div className="info"><strong>Created_at:</strong> {user.created_at}</div>
          </>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <button className="back-btn" onClick={() => navigate("/index")}>
          ← Back to Store
        </button>
      </div>
    </div>
  );
}
