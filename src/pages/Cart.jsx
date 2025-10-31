import { useCart } from '../context/CartContext';
import styles from '../styles/Cart.module.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartLoading, checkout } = useCart();

  if (isCartLoading) {
    return <div className={styles.page}><p>Cargando tu carrito... ⏳</p></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <h2 className={styles.title}>Tu Carrito está Vacío 😔</h2>
        <p>Parece que aún no has agregado ninguna obra de arte.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Tu Carrito de Compras</h2>

      <div className={styles.cartGrid}>
        {/* Lista de Ítems */}
        <div className={styles.itemList}>
          {cartItems.map(item => (
            <div key={item.product.id} className={styles.cartItem}>
              <img
                src={item.product.image_url}
                alt={item.product.title}
                className={styles.itemImage}
              />

              <div className={styles.itemDetails}>
                <h4>{item.product.title}</h4>
                <p className={styles.itemPrice}>${item.product.price}</p>

                <div className={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.itemActions}>
                <p className={styles.itemSubtotal}>
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className={styles.removeButton}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className={styles.summary}>
          <h3>Resumen del Pedido</h3>
          <div className={styles.summaryRow}>
            <span>Total Ítems:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.totalLabel}>Total a Pagar:</span>
            <span className={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
          </div>

          <button
            className={styles.checkoutButton}
            disabled={cartItems.length === 0}
            onClick={checkout}
          >
            Pagar Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
