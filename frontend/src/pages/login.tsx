import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const loggedIn = localStorage.getItem("logged_in") === "true";

  // ⭐ Redirect if already logged in
  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      // ⭐ If backend returned error (400), do NOT log in
      if (!res.ok) {
        setErrorMsg(json.detail || json.error || "Login failed");
        return; // STOP — do NOT continue
      }

      // ⭐ Success
      setSuccessMsg(json.message || "Logged in!");

      localStorage.setItem("logged_in", "true");
      localStorage.setItem("user_email", email);

      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e1e2f, #2a2a40);
          font-family: Inter, sans-serif;
          padding: 20px;
        }

        .glass-card {
          width: 100%;
          max-width: 420px;
          padding: 32px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
          color: white;
        }

        .title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .input-label {
          margin-bottom: 6px;
          font-size: 14px;
          opacity: 0.9;
        }

        .input-field {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: none;
          outline: none;
          background: rgba(255,255,255,0.12);
          color: white;
          font-size: 15px;
          margin-bottom: 18px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6a5acd, #7b68ee);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .msg {
          margin-top: 16px;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
        }

        .msg.error {
          background: rgba(255, 80, 80, 0.2);
          border: 1px solid rgba(255, 80, 80, 0.4);
        }

        .msg.success {
          background: rgba(80, 255, 120, 0.2);
          border: 1px solid rgba(80, 255, 120, 0.4);
        }

        .switcher {
          margin-top: 20px;
          text-align: center;
        }

        .switcher a {
          color: #cfcfff;
          text-decoration: none;
          font-size: 14px;
        }
      `}</style>

      <div className="glass-card">
        <div className="title">Welcome Back</div>

        <form onSubmit={handleSubmit}>
          <label className="input-label">Email</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="input-label">Password</label>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          {errorMsg && <div className="msg error">{errorMsg}</div>}
          {successMsg && <div className="msg success">{successMsg}</div>}
        </form>

        <div className="switcher">
          <Link to="/register">Switch to Register</Link>
        </div>
      </div>
    </div>
  );
}
