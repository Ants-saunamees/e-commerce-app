import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  id: number;
  email: string;
  is_admin: boolean;
};

export default function AdminCategoryPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [createData, setCreateData] = useState({
    name: "",
    parent_id: "",
  });

  const [updateData, setUpdateData] = useState({
    category_id: "",
    name: "",
    parent_id: "",
  });

  const [deleteId, setDeleteId] = useState<string>("");

  // -------------------------------
  // CHECK ADMIN
  // -------------------------------
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("http://localhost:8000/auth/profile", {
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok || !json.is_admin) {
          navigate("/index");
          return;
        }

        setUser(json);
      } catch {
        navigate("/index");
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [navigate]);

  // -------------------------------
  // CREATE CATEGORY
  // -------------------------------
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/admin/category", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createData.name,
          parent_id: createData.parent_id
            ? parseInt(createData.parent_id)
            : null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Category created!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed");
    }
  }

  // -------------------------------
  // UPDATE CATEGORY
  // -------------------------------
  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(
        `http://localhost:8000/admin/category/${updateData.category_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updateData.name || null,
            parent_id: updateData.parent_id
              ? parseInt(updateData.parent_id)
              : null,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Category updated!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed");
    }
  }

  // -------------------------------
  // DELETE CATEGORY
  // -------------------------------
  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(
        `http://localhost:8000/admin/category/${deleteId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Category deleted!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed");
    }
  }

  if (loading) {
    return (
      <div className="admin-wrapper">
        <div className="loading">Checking admin...</div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1e2f, #2a2a40);
          color: white;
          font-family: Inter, sans-serif;
          padding: 40px;
        }

        .glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 0 20px rgba(255,255,255,0.08);
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: none;
        }

        .btn {
          padding: 12px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4d79ff, #3366ff);
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }

        .delete-btn {
          background: linear-gradient(135deg, #ff4d4d, #ff3333);
        }

        .back-btn {
          margin-top: 20px;
          padding: 12px 20px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4d79ff, #3366ff);
          border: none;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .error-box {
          background: #ffdddd;
          color: #a30000;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 600;
        }
      `}</style>

      {errorMsg && <div className="error-box">{errorMsg}</div>}

      {/* CREATE CATEGORY */}
      <div className="glass">
        <div className="title">Create Category</div>
        <form onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Name"
            value={createData.name}
            onChange={(e) =>
              setCreateData({ ...createData, name: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Parent ID (optional)"
            value={createData.parent_id}
            onChange={(e) =>
              setCreateData({ ...createData, parent_id: e.target.value })
            }
          />

          <button className="btn" type="submit">
            Create Category
          </button>
        </form>
      </div>

      {/* UPDATE CATEGORY */}
      <div className="glass">
        <div className="title">Update Category</div>
        <form onSubmit={handleUpdate}>
          <input
            className="input"
            placeholder="Category ID"
            value={updateData.category_id}
            onChange={(e) =>
              setUpdateData({ ...updateData, category_id: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="New Name"
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="New Parent ID (optional)"
            value={updateData.parent_id}
            onChange={(e) =>
              setUpdateData({ ...updateData, parent_id: e.target.value })
            }
          />

          <button className="btn" type="submit">
            Update Category
          </button>
        </form>
      </div>

      {/* DELETE CATEGORY */}
      <div className="glass">
        <div className="title">Delete Category</div>
        <form onSubmit={handleDelete}>
          <input
            className="input"
            placeholder="Category ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />

          <button className="btn delete-btn" type="submit">
            Delete Category
          </button>
        </form>
      </div>

      <button className="back-btn" onClick={() => navigate("/admin")}>
        ← Back to Admin Dashboard
      </button>
    </div>
  );
}
