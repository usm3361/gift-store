import { productsData, categories, herofullImages } from "./data.js";
import "./app.css";
import { useEffect, useState } from "react";
// ייבוא הנתונים מהקובץ הנפרד

function App() {
  const [filter, setFilter] = useState("הכל");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentHero, setCurrentHero] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // לוגיקה להחלפת תמונת באנר כל 5 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % herofullImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // סינון מוצרים לפי קטגוריה (תומך במוצרים עם מספר קטגוריות)
  const filteredProducts =
    filter === "הכל"
      ? productsData
      : productsData.filter((p) => p.category.includes(filter));

  // פונקציה לאיפוס הכל בסגירת הדיאלוג
  const closeDialog = () => {
    setSelectedProduct(null);
    setIsZoomed(false);
    setPosition({ x: 0, y: 0 });
  };
  return (
    <div className="app-container">
      {/* חלק 1: לוגו וטלפון - נשאר למעלה */}
      <header className="main-header">
        <div className="nav-top">
          <div className="logo-area">
            <img src="./public/img/logo.png" alt="Logo" className="logo" />
          </div>
            <img
              className="store"
              src="public\img\name-store.svg"
              alt="Name Store"
            />
          <a href="tel:0548433332" className="phone-link">
            054-8433332
            <span class="material-symbols-outlined">call</span>
          </a>
        </div>
      </header>

      {/* חלק 2: הבאנר המתחלף - נעלם בגלילה */}
      <div className="hero-section">
        <img
          src={herofullImages[currentHero]}
          alt="Banner"
          className="hero-img"
        />
      </div>

      {/* חלק 3: תפריט הקטגוריות - הופך ל-Sticky */}
      <nav className="sticky-nav">
        <ul className="categories-menu">
          {categories.map((cat) => (
            <li
              key={cat}
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </nav>

      {/* גריד מוצרים */}
      <main className="product-grid">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="product-img-wrapper">
              <img src={product.thumbnail} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <p className="short-desc">{product.shortDesc}</p>
            <span className="price">{product.price}</span>
          </div>
        ))}
      </main>

      {/* דיאלוג מוצר מורחב */}

      {selectedProduct && (
  <div className="dialog-overlay" onClick={closeDialog}>
    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
      {/* כפתור סגירה */}
      <button className="close-btn" onClick={closeDialog}>×</button>

      {/* קונטיינר התמונה עם אפקט הגרירה והזום */}
      <div
        className={`zoom-container ${isZoomed ? "zoomed" : ""} ${isDragging ? "grabbing" : ""}`}
        onMouseDown={(e) => {
          if (!isZoomed) return;
          setIsDragging(true);
          // מחשבים את נקודת ההתחלה יחסית למיקום הנוכחי של התמונה
          setStartPos({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
          });
        }}
        onMouseMove={(e) => {
          if (!isDragging || !isZoomed) return;
          e.preventDefault();
          // מעדכנים את מיקום התמונה בזמן גרירה
          setPosition({
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y,
          });
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onClick={() => {
          // מבצעים זום/ביטול זום רק אם לא הייתה גרירה משמעותית
          if (!isDragging) {
            setIsZoomed(!isZoomed);
            if (isZoomed) setPosition({ x: 0, y: 0 }); // איפוס מיקום כשמבטלים זום
          }
        }}
      >
        <img
          src={selectedProduct.fullImage}
          alt={selectedProduct.name}
          className="zoom-image"
          style={{
            transform: isZoomed
              ? `scale(2.5) translate(${position.x / 2.5}px, ${position.y / 2.5}px)`
              : "scale(1)",
          }}
          draggable="false"
        />
        
        {/* רמז למשתמש - מופיע רק כשלא בזום */}
        {!isZoomed && <div className="zoom-hint">לחץ להגדלה וגרירה 🔍</div>}
      </div>

      {/* פרטי המוצר */}
      <div className="product-details">
        <h2>{selectedProduct.name}</h2>
        <p className="full-desc">{selectedProduct.longDesc}</p>
        <div className="price-tag-large">{selectedProduct.price}</div>
      </div>
    </div>
  </div>
)}

      {/* כפתור וואטסאפ צף */}
      <a
        href="https://wa.me/972556663852"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="דברו איתנו בוואטסאפ"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
        />
      </a>
    </div>
  );
}

export default App;
