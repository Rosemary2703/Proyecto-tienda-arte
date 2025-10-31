import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import styles from '../styles/ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID de obra no proporcionado.");
      setIsLoading(false);
      return;
    }
    fetchArtworkDetail(id);
  }, [id]);

  const fetchArtworkDetail = async (artworkId) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("id, title, description, price, image_url, category_id, stock")
      .eq("id", artworkId)
      .single();
    setIsLoading(false);

    if (error) {
      console.error(error);
      setError("No pudimos encontrar la obra solicitada.");
    } else {
      setArtwork(data);
    }
  };

  const handleAddToCart = () => {
    if (artwork && artwork.stock > 0) {
      addToCart(artwork);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 3000);
    }
  };

  if (isLoading) return <div className={styles.container}><p>Cargando obra... ⏳</p></div>;
  if (error) return <div className={styles.container}><p className={styles.errorMessage}>{error}</p></div>;
  if (!artwork) return <div className={styles.container}><p>Obra no encontrada.</p></div>;

  const cartItem = cartItems.find(item => item.product.id === artwork.id);
  const canAddToCart = artwork.stock > 0 && (!cartItem || cartItem.quantity < artwork.stock);

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img src={artwork.image_url} alt={artwork.title} className={styles.mainImage} />
      </div>
      <div className={styles.detailsSection}>
        <h1 className={styles.title}>{artwork.title}</h1>
        <p className={styles.price}>${artwork.price}</p>
        <p className={styles.description}>{artwork.description}</p>
        <div className={styles.stockInfo}>
          {artwork.stock > 0 
            ? <span className={styles.inStock}>Disponible ({artwork.stock} piezas)</span>
            : <span className={styles.outOfStock}>Agotado</span>
          }
        </div>
        {isAdded && <p style={{ color: 'green', fontWeight: 'bold' }}>¡Añadido al carrito!</p>}
        {cartItem && cartItem.quantity >= artwork.stock && (
          <p className={styles.errorMessage}>Límite de stock alcanzado.</p>
        )}
        {artwork.stock > 0 && (
          <button 
            className={styles.addToCartButton}
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            🛒 {canAddToCart ? 'Añadir al carrito' : 'No disponible'}
          </button>
        )}
      </div>
    </div>
  );
}
