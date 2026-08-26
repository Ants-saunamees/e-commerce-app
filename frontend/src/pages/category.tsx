import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type ProductDTO = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number;
  image_url: string | null;
  is_active: boolean;
};

export default function CategoryPage() {
  const { category_id } = useParams();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    async function load() {
      setErrorMsg("");
      setSuccessMsg("");

      try {
        const res = await fetch(
          `http://localhost:8000/products/category/${category_id}`
        );
        const json = await res.json();

        if (!res.ok) {
          setErrorMsg(json.detail || "Failed to load category products");
          return;
        }

        setProducts(json);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load category products");
      }
    }

    load();
  }, [category_id]);

  if (errorMsg) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        <h2>Error</h2>
        <p>{errorMsg}</p>
        <Link to="/index" style={{ color: "#9fc5ff" }}>← Back to Store</Link>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        <h2>No products found in this category</h2>
        <Link to="/index" style={{ color: "#9fc5ff" }}>← Back to Store</Link>
      </div>
    );
  }

  const categoryName = `Category ${category_id}`;

  return (
    <div className="category-wrapper">
      <style>{`
        .category-wrapper {
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
          max-width: 1000px;
          margin: auto;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .product-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          color: white;
          transition: 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-card:hover {
          background: rgba(255,255,255,0.15);
        }

        .product-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 6px;
          margin-bottom: 10px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .product-price {
          opacity: 0.8;
          margin-bottom: 10px;
        }

        .error-box {
          background: #ffdddd;
          color: #a30000;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .success-box {
          background: #ddffdd;
          color: #006600;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 600;
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
          text-decoration: none;
          display: inline-block;
        }
      `}</style>

      <div className="glass">

        {errorMsg && <div className="error-box">{errorMsg}</div>}
        {successMsg && <div className="success-box">{successMsg}</div>}

        <div className="title">{categoryName}</div>

        <div className="product-grid">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="product-card"
            >
              <img
                src={
                  p.image_url ||
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjUwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
                }
                alt={p.name}
                className="product-img"
              />

              <div className="product-name">{p.name}</div>
              <div className="product-price">${p.price}</div>

              <div style={{ opacity: 0.7 }}>
                {p.description || "No description"}
              </div>
            </Link>
          ))}
        </div>

        <Link className="back-btn" to="/index">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
