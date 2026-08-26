import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("logged_in") === "true"
  );

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(localStorage.getItem("logged_in") === "true");
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const prodRes = await fetch("http://localhost:8000/products/");
        const prodJson = await prodRes.json();
        setProducts(prodJson);

        const catRes = await fetch("http://localhost:8000/categories/");
        const catJson = await catRes.json();
        setCategories(catJson.categories || []);
      } catch (err) {
        console.error("Load failed:", err);
      }
    }
    load();
  }, []);

  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;

    const q = e.currentTarget.value.trim();
    if (!q) return;

    try {
      const res = await fetch(
        `http://localhost:8000/search/?q=${encodeURIComponent(q)}`
      );
      const json = await res.json();

      setSearchResults(json || []);
      setSearchActive(true);
    } catch (err) {
      console.error("Search failed:", err);
    }
  }

  function clearSearch() {
    setSearchActive(false);
    setSearchResults([]);
  }

  return (
    <div className="index-wrapper">
      <style>{`
        .index-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #141421, #1f1f33);
          color: white;
          font-family: Inter, sans-serif;
          padding: 24px;
        }

        /* TOP BAR */
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .app-name {
          font-size: 28px;
          font-weight: 700;
          color: #8ab4ff;
          cursor: pointer;
          transition: 0.25s;
        }

        .app-name:hover {
          transform: scale(1.08);
          color: #c7ddff;
        }

        .search-input {
          flex: 1;
          margin-left: 20px;
          margin-right: 20px;
          padding: 12px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.12);
          border: none;
          color: white;
          font-size: 15px;
          transition: 0.25s;
        }

        .search-input:focus {
          outline: none;
          background: rgba(255,255,255,0.18);
          transform: scale(1.02);
        }

        .profile-pic {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: 0.25s;
        }

        .profile-pic:hover {
          transform: scale(1.12);
        }

        .nav-btn {
          margin-right: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          text-decoration: none;
          transition: 0.25s;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }

        /* GLASS BOX */
        .glass {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .section-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        /* CATEGORY BUBBLES */
        .category-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .category-bubble {
          padding: 10px 18px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.25);
          color: #9fc5ff;
          font-weight: 600;
          text-decoration: none;
          transition: 0.25s;
          animation: popIn 0.3s ease;
        }

        .category-bubble:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.08);
        }

        /* PRODUCT GRID */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .product-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 14px;
          text-decoration: none;
          color: white;
          transition: 0.25s;
          animation: fadeIn 0.4s ease;
        }

        .product-card:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 0 20px rgba(255,255,255,0.15);
        }

        .product-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: contain;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 6px;
          margin-bottom: 10px;
          transition: 0.25s;
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .product-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .product-price {
          opacity: 0.8;
        }

        .clear-search {
          margin-top: 10px;
          padding: 8px 14px;
          background: rgba(255,255,255,0.12);
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.18);
          color: #9fc5ff;
          font-weight: 600;
          transition: 0.25s;
        }

        .clear-search:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }
      `}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="app-name" onClick={() => navigate("/")}>
          AntsShop
        </div>

        <input
          className="search-input"
          placeholder="Search products..."
          onKeyDown={handleSearch}
        />

        {loggedIn ? (
          <Link to="/profile" className="profile-pic">👤</Link>
        ) : (
          <>
            <Link className="nav-btn" to="/login">Login</Link>
            <Link className="nav-btn" to="/register">Register</Link>
          </>
        )}
      </div>

      {/* NAV BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        {loggedIn && <Link className="nav-btn" to="/cart">Cart</Link>}
        {loggedIn && <Link className="nav-btn" to="/orders">Orders</Link>}
      </div>

      {/* SEARCH RESULTS */}
      {searchActive && (
        <div className="glass">
          <div className="section-title">Search Results</div>

          {searchResults.length === 0 && (
            <div style={{ opacity: 0.7 }}>No products found.</div>
          )}

          <div className="product-grid">
            {searchResults.map((p: any) => (
              <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                <img src={p.image_url} className="product-img" />
                <div className="product-name">{p.name}</div>
                <div className="product-price">${p.price}</div>
              </Link>
            ))}
          </div>

          <div className="clear-search" onClick={clearSearch}>
            Clear Search
          </div>
        </div>
      )}

      {/* ONLY SHOW NORMAL CONTENT IF SEARCH IS NOT ACTIVE */}
      {!searchActive && (
        <>
          {/* CATEGORIES */}
          <div className="glass">
            <div className="section-title">Categories</div>
            <div className="category-grid">
              {categories.map((c: any) => (
                <Link key={c.id} to={`/category/${c.id}`} className="category-bubble">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="glass">
            <div className="section-title">Products</div>
            <div className="product-grid">
              {products.map((p: any) => (
                <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                  <img src={p.image_url} className="product-img" />
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">${p.price}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
