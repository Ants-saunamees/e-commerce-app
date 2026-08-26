import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category_id: number;
  image_url: string | null;
  is_active: boolean;
};

export default function ProductPage() {
  const { product_id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const [quantity, setQuantity] = useState<number>(1);

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Animation states
  const [animateAdd, setAnimateAdd] = useState(false);
  const [floatBubble, setFloatBubble] = useState(false);

  async function addToCart() {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:8000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          product_id: product?.id,
          quantity: quantity,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.detail || "Failed to add to cart");
        return;
      }

      setSuccessMsg("Added to cart!");

      // Trigger animations
      setAnimateAdd(true);
      setFloatBubble(true);

      // Reset animations
      setTimeout(() => setAnimateAdd(false), 400);
      setTimeout(() => setFloatBubble(false), 700);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add to cart");
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:8000/products/${product_id}`);
        const json = await res.json();

        if (!res.ok) {
          setErrorMsg(json.detail || "Product not found");
          return;
        }

        setProduct(json);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load product");
      }
    }

    load();
  }, [product_id]);

  if (errorMsg && !product) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        <h2>Error</h2>
        <p>{errorMsg}</p>
        <Link to="/index" style={{ color: "#9fc5ff" }}>
          ← Back to Store
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Loading product...
      </div>
    );
  }

  return (
    <div className="product-wrapper">
      <style>{`
        .product-wrapper {
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
          max-width: 700px;
          margin: auto;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .img {
          width: 100%;
          height: 350px;
          object-fit: contain;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 10px;
          margin-bottom: 20px;
        }

        .price {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .desc {
          opacity: 0.85;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .info-row {
          margin-bottom: 10px;
        }

        .qty-box {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          padding: 8px 14px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
        }

        .qty-number {
          font-size: 20px;
          font-weight: 600;
          min-width: 40px;
          text-align: center;
        }

        .add-btn {
          margin-top: 20px;
          padding: 14px 22px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4d79ff, #3366ff);
          border: none;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          display: inline-block;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .add-btn.animate {
          transform: scale(1.08);
          box-shadow: 0 0 18px rgba(77, 121, 255, 0.6);
        }

        .float-bubble {
          position: absolute;
          right: 20px;
          top: -10px;
          font-size: 20px;
          font-weight: 700;
          color: #4d79ff;
          animation: bubbleUp 0.7s ease forwards;
          pointer-events: none;
        }

        @keyframes bubbleUp {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px);
          }
        }

        .back-btn {
          margin-top: 20px;
          padding: 12px 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          margin-left: 10px;
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
      `}</style>

      <div className="glass">
        {errorMsg && <div className="error-box">{errorMsg}</div>}
        {successMsg && <div className="success-box">{successMsg}</div>}

        <div className="title">{product.name}</div>

        {product.image_url && (
          <img src={product.image_url} alt={product.name} className="img" />
        )}

        <div className="price">${product.price}</div>

        <div className="desc">{product.description || "No description"}</div>

        <div className="info-row">
          <strong>Stock:</strong> {product.stock}
        </div>

        <div className="info-row">
          <strong>Category:</strong>{" "}
          <Link to={`/category/${product.category_id}`} style={{ color: "#9fc5ff" }}>
            Category {product.category_id}
          </Link>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="qty-box">
          <button
            className="qty-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            -
          </button>

          <div className="qty-number">{quantity}</div>

          <button
            className="qty-btn"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>

        {/* Add button + animation bubble */}
        <div style={{ position: "relative" }}>
          {floatBubble && <div className="float-bubble">+{quantity}</div>}

          <button
            className={`add-btn ${animateAdd ? "animate" : ""}`}
            onClick={addToCart}
          >
            Add {quantity} to Cart
          </button>
        </div>

        <Link className="back-btn" to="/index">
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}
