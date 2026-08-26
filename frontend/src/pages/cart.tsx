import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [totals, setTotals] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // -----------------------------
  // LOAD CART + TOTALS
  // -----------------------------
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:8000/cart/", {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) return setError(json.detail || "Failed to load cart.");
      setCart(json);
    } catch {
      setError("Failed to load cart.");
    }
  };

  const fetchTotals = async () => {
    try {
      const res = await fetch("http://localhost:8000/cart/totals", {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) return setError(json.detail || "Failed to load totals.");
      setTotals(json);
    } catch {
      setError("Failed to load totals.");
    }
  };

  useEffect(() => {
    (async () => {
      await fetchCart();
      await fetchTotals();
      setLoading(false);
    })();
  }, []);

  // -----------------------------
  // UPDATE QUANTITY
  // -----------------------------
  const updateQuantity = async (productId: number, quantity: number) => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:8000/cart/item/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const json = await res.json();
      if (!res.ok) return setError(json.detail || "Failed to update quantity.");

      setCart(json);
      fetchTotals();
      setSuccess("Quantity updated!");
    } catch {
      setError("Failed to update quantity.");
    }
  };

  // -----------------------------
  // REMOVE ITEM
  // -----------------------------
  const removeItem = async (productId: number) => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`http://localhost:8000/cart/item/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) return setError(json.detail || "Failed to remove item.");

      setCart(json);
      fetchTotals();
      setSuccess("Item removed!");
    } catch {
      setError("Failed to remove item.");
    }
  };

  // -----------------------------
  // CLEAR CART
  // -----------------------------
  const clearCart = async () => {
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:8000/cart/clear", {
        method: "POST",
        credentials: "include",
      });

      const json = await res.json();
      if (!res.ok) return setError(json.detail || "Failed to clear cart.");

      setCart({ items: [] });
      setTotals({ subtotal: 0, tax: 0, total: 0 });
      setSuccess("Cart cleared!");
    } catch {
      setError("Failed to clear cart.");
    }
  };

  // -----------------------------
  // ⭐ PAY WITH PAYPAL (auto-create order)
  // -----------------------------
  const payWithPayPal = async () => {
    setError(null);
    setSuccess(null);

    try {
      // 1. Create order
      const orderRes = await fetch("http://localhost:8000/orders/", {
        method: "POST",
        credentials: "include",
      });

      const orderJson = await orderRes.json();
      if (!orderRes.ok)
        return setError(orderJson.detail || "Failed to create order.");

      const orderId = orderJson.id;

      // 2. Create PayPal payment
      const payRes = await fetch("http://localhost:8000/payment/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      const payJson = await payRes.json();
      if (!payRes.ok)
        return setError(payJson.detail || "Failed to start PayPal payment.");

      // 3. Redirect to PayPal
      window.location.href = payJson.approval_url;
    } catch {
      setError("Failed to start PayPal payment.");
    }
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading)
    return (
      <div className="index-wrapper fade-in">
        <div className="glass pulse">Loading cart...</div>
      </div>
    );

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="index-wrapper fade-in">
      <style>{`
        .index-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1e2f, #2a2a40);
          color: white;
          font-family: Inter, sans-serif;
          padding: 24px;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .pulse {
          animation: pulseAnim 1.4s infinite ease-in-out;
        }

        @keyframes pulseAnim {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        .glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 0 20px rgba(255,255,255,0.08);
          animation: fadeIn 0.6s ease-out;
        }

        .error-box, .success-box {
          animation: fadeIn 0.4s ease-out;
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

        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .item {
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: fadeIn 0.4s ease-out;
        }

        .qty-btn, .remove-btn, .clear-btn, .paypal-btn {
          transition: all 0.2s ease;
        }

        .qty-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }

        .remove-btn:hover {
          background: rgba(255,80,80,0.35);
          transform: scale(1.05);
        }

        .clear-btn:hover {
          background: rgba(255,80,80,0.35);
          transform: scale(1.05);
        }

        .paypal-btn:hover {
          background: rgba(0,120,255,0.35);
          transform: scale(1.05);
        }

        .paypal-btn {
          padding: 12px 16px;
          background: rgba(0,120,255,0.25);
          border: 1px solid rgba(0,120,255,0.4);
          border-radius: 12px;
          cursor: pointer;
          margin-top: 12px;
          color: white;
          font-weight: 600;
        }

        .nav-btn {
          margin-right: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: scale(1.05);
        }
      `}</style>

      <div style={{ marginBottom: "20px" }}>
        <Link className="nav-btn" to="/">← Back</Link>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* CART */}
      <div className="glass">
        <div className="section-title">Your Cart</div>

        {cart.items.length === 0 && (
          <div style={{ opacity: 0.7 }}>Your cart is empty.</div>
        )}

        {cart.items.map((item: any) => (
          <div key={item.product_id} className="item">
            <div>
              <strong>{item.name}</strong>
              <div style={{ opacity: 0.7 }}>
                ${item.price} × {item.quantity}
              </div>
            </div>

            <div>
              <button
                className="qty-btn"
                onClick={() =>
                  updateQuantity(item.product_id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>

              <button
                className="qty-btn"
                onClick={() =>
                  updateQuantity(item.product_id, item.quantity + 1)
                }
              >
                +
              </button>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.product_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {cart.items.length > 0 && (
          <>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>

            <button className="paypal-btn" onClick={payWithPayPal}>
              Pay with PayPal
            </button>
          </>
        )}
      </div>

      {/* TOTALS */}
      <div className="glass">
        <div className="section-title">Totals</div>

        {totals ? (
          <>
            <div className="item">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="item">
              <span>Tax</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="item">
              <strong>Total</strong>
              <strong>${totals.total.toFixed(2)}</strong>
            </div>
          </>
        ) : (
          <div style={{ opacity: 0.7 }}>No totals available.</div>
        )}
      </div>
    </div>
  );
}
