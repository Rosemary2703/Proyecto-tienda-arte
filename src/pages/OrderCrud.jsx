import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCRUD.module.css";

export default function OrderCRUD() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Error al cargar los pedidos");
      console.error(error);
    } else {
      setOrders(data);
    }
    setIsLoading(false);
  };

  const fetchOrderItems = async (orderId) => {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        products (
          nombre,
          precio,
          imagen_url
        )
      `)
      .eq("order_id", orderId);

    if (error) {
      console.error(error);
      setError("No se pudieron cargar los items del pedido");
    } else {
      setOrderItems(data);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = async (order) => {
    setSelectedOrder(order);
    await fetchOrderItems(order.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error(error);
      setError("Error al eliminar pedido");
    } else {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setError("Error al actualizar el estado del pedido");
    } else {
      fetchOrders();
      if (selectedOrder?.id === orderId)
        setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  if (isLoading) return <p className={styles.loading}>Cargando pedidos...</p>;

  return (
    <div className={styles.container}>
      {/* 🔙 BOTÓN VOLVER AL PANEL ADMIN CON ESTILO UNIFICADO */}
      <div className={styles.backContainer}>
        <Link to="/admin" className={styles.backButton}>
          ⬅ Volver al Panel Admin
        </Link>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Gestión de Pedidos</h1>
      </header>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Tabla de pedidos */}
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id.slice(0, 8)}...</td>
              <td>{o.profiles?.email || "Sin usuario"}</td>
              <td>${o.total?.toFixed(2) || "0.00"}</td>
              <td>{o.status}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleView(o)}
                  className={styles.viewButton}
                >
                  Ver
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className={styles.detailCard}>
          <h3>Detalles del Pedido</h3>
          <p>
            <strong>ID:</strong> {selectedOrder.id}
          </p>
          <p>
            <strong>Usuario:</strong> {selectedOrder.profiles?.email}
          </p>
          <p>
            <strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}
          </p>

          <label>Estado:</label>
          <select
            value={selectedOrder.status}
            onChange={(e) =>
              handleStatusChange(selectedOrder.id, e.target.value)
            }
          >
            <option value="pendiente">Pendiente</option>
            <option value="procesando">Procesando</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <h4 style={{ marginTop: "15px" }}>Items:</h4>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.products?.imagen_url ? (
                      <img
                        src={item.products.imagen_url}
                        alt={item.products.nombre}
                        style={{ width: "60px", borderRadius: "6px" }}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>{item.products?.nombre || "Desconocido"}</td>
                  <td>{item.quantity}</td>
                  <td>
                    $
                    {item.products?.precio?.toFixed(2) ||
                      item.price?.toFixed(2) ||
                      "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={() => setSelectedOrder(null)}
            className={styles.cancelButton}
          >
            Cerrar Detalle
          </button>
        </div>
      )}
    </div>
  );
}
