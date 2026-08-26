import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  id: number;
  email: string;
  is_admin: boolean;
};

export default function AdminProductPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
  });

  const [updateData, setUpdateData] = useState({
    product_id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image_url: "",
    is_active: "",
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
  // CREATE PRODUCT
  // -------------------------------
  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8000/admin/product", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createData.name,
          description: createData.description || null,
          price: parseFloat(createData.price),
          stock: parseInt(createData.stock),
          category_id: parseInt(createData.category_id),
          image_url: createData.image_url || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Product created!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed");
    }
  }

  // -------------------------------
  // UPDATE PRODUCT
  // -------------------------------
  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(
        `http://localhost:8000/admin/product/${updateData.product_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updateData.name || null,
            description: updateData.description || null,
            price: updateData.price ? parseFloat(updateData.price) : null,
            stock: updateData.stock ? parseInt(updateData.stock) : null,
            category_id: updateData.category_id
              ? parseInt(updateData.category_id)
              : null,
            image_url: updateData.image_url || null,
            is_active:
              updateData.is_active === ""
                ? null
                : updateData.is_active === "true",
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Product updated!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed");
    }
  }

  // -------------------------------
  // DELETE PRODUCT
  // -------------------------------
  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:8000/admin/product/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Unknown error");
      } else {
        setErrorMsg("Product deleted!");
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

      {/* CREATE PRODUCT */}
      <div className="glass">
        <div className="title">Create Product</div>
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
            placeholder="Description"
            value={createData.description}
            onChange={(e) =>
              setCreateData({ ...createData, description: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Price"
            value={createData.price}
            onChange={(e) =>
              setCreateData({ ...createData, price: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Stock"
            value={createData.stock}
            onChange={(e) =>
              setCreateData({ ...createData, stock: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Category ID"
            value={createData.category_id}
            onChange={(e) =>
              setCreateData({ ...createData, category_id: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Image URL"
            value={createData.image_url}
            onChange={(e) =>
              setCreateData({ ...createData, image_url: e.target.value })
            }
          />

          <button className="btn" type="submit">
            Create Product
          </button>
        </form>
      </div>

      {/* UPDATE PRODUCT */}
      <div className="glass">
        <div className="title">Update Product</div>
        <form onSubmit={handleUpdate}>
          <input
            className="input"
            placeholder="Product ID"
            value={updateData.product_id}
            onChange={(e) =>
              setUpdateData({ ...updateData, product_id: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Name"
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Description"
            value={updateData.description}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Price"
            value={updateData.price}
            onChange={(e) =>
              setUpdateData({ ...updateData, price: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Stock"
            value={updateData.stock}
            onChange={(e) =>
              setUpdateData({ ...updateData, stock: e.target.value })
            }
          />
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
            placeholder="Image URL"
            value={updateData.image_url}
            onChange={(e) =>
              setUpdateData({ ...updateData, image_url: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Is Active (true/false)"
            value={updateData.is_active}
            onChange={(e) =>
              setUpdateData({ ...updateData, is_active: e.target.value })
            }
          />

          <button className="btn" type="submit">
            Update Product
          </button>
        </form>
      </div>

      {/* DELETE PRODUCT */}
      <div className="glass">
        <div className="title">Delete Product</div>
        <form onSubmit={handleDelete}>
          <input
            className="input"
            placeholder="Product ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />

          <button className="btn delete-btn" type="submit">
            Delete Product
          </button>
        </form>
      </div>

      <button className="back-btn" onClick={() => navigate("/admin")}>
        ← Back to Admin Dashboard
      </button>
    </div>
  );
}
