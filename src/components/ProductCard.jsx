import { Link } from "react-router-dom";
import StarRating from "../components/StarRating"; // 👈 importa el componente
import styles from "../styles/ProductCard.module.css";

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className={styles.card}>
      <img
        src={product.image_url}
        alt={product.title}
        className={styles.image}
      />

      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>${product.price.toLocaleString()}</p>

        {/* ⭐ Sección de estrellas integrada */}
        <div className={styles.starWrapper}>
          <div className={styles.starContainer}>
            <StarRating rating={product.rating || 0} />
          </div>
          <p className={styles.ratingCount}>
            ({product.rating_count || 0} valoraciones)
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to={`/artworks/${product.id}`} className={styles.button}>
          Ver detalle
        </Link>
        <button onClick={handleAddToCart} className={styles.button}>
          ➕ Añadir
        </button>
      </div>
    </div>
  );
}
