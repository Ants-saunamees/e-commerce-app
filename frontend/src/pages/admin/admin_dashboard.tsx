import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("http://localhost:8000/auth/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/index");
          return;
        }

        const user = await res.json();

        if (!user.is_admin) {
          navigate("/index");
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        navigate("/index");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e1e2f, #2a2a40)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: 700,
        }}
      >
        Checking admin…
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="index-wrapper">
      <style>{`
        .index-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1e2f, #2a2a40);
          color: white;
          font-family: Inter, sans-serif;
          padding: 24px;
        }

        .glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 0 20px rgba(255,255,255,0.08);
        }

        .nav-btn {
          display: block;
          margin-bottom: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          text-decoration: none;
          font-size: 16px;
        }
      `}</style>

      <div className="glass">
        <h2 style={{ marginBottom: "20px" }}>Admin Dashboard</h2>

        <Link className="nav-btn" to="/admin/products">
          Manage Products
        </Link>

        <Link className="nav-btn" to="/admin/categories">
          Manage Categories
        </Link>

        <Link className="nav-btn" to="/admin/orders">
          View All Orders
        </Link>

        <Link className="nav-btn" to="/admin/users">
          Manage Users
        </Link>

        <Link className="nav-btn" to="/index">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
