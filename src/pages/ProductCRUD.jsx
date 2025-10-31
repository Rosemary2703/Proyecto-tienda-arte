import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProductForm from '../components/ProductForm';
import styles from '../styles/ProductCRUD.module.css';
import { useNavigate } from 'react-router-dom';

export default function ProductCRUD() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  const navigate = useNavigate();

  // ----------------------
  // Cargar obras (READ)
  // ----------------------
  const fetchArtworks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('artworks') // 👈 tu tabla real en Supabase
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al cargar obras:', error);
      setError('Error al cargar la lista de obras.');
    } else {
      setArtworks(data);
      setError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  // ----------------------
  // Editar obra (UPDATE)
  // ----------------------
  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    setIsFormVisible(true);
  };

  // ----------------------
  // Eliminar obra (DELETE)
  // ----------------------
  const handleDelete = async (artworkId, artworkName) => {
    if (!window.confirm(`¿Estás seguro de eliminar la obra "${artworkName}"?`)) {
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('artworks') // 👈 tabla correcta
      .delete()
      .eq('id', artworkId);

    if (error) {
      console.error('Error al eliminar la obra:', error);
      setError('Error al eliminar la obra.');
      setIsLoading(false);
    } else {
      setArtworks(artworks.filter((a) => a.id !== artworkId));
      setIsLoading(false);
    }
  };

  // ----------------------
  // Guardar cambios (recarga si es necesario)
  // ----------------------
  const handleSave = (shouldRefetch) => {
    if (shouldRefetch) {
      fetchArtworks();
    }
    setEditingArtwork(null);
    setIsFormVisible(false);
  };

  // ----------------------
  // Renderizado
  // ----------------------
  if (isLoading && artworks.length === 0) {
    return <div className={styles.loading}>Cargando obras...</div>;
  }

  return (
    <div className={styles.container}>
      {/* ENCABEZADO */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/admin')}
          >
            ← Volver al Panel
          </button>
          <h1 className={styles.title}>Gestión de Obras de Arte</h1>
        </div>

        <button
          className={styles.addButton}
          onClick={() => {
            setEditingArtwork(null);
            setIsFormVisible(true);
          }}
        >
          + Añadir Nueva Obra
        </button>
      </header>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Modal / Formulario */}
      {isFormVisible && (
        <div className={styles.formOverlay}>
          <ProductForm
            currentProduct={editingArtwork}
            onClose={() => handleSave(false)}
            onSave={handleSave}
          />
        </div>
      )}

      {/* Tabla de obras */}
      <table className={styles.productTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((artwork) => (
            <tr key={artwork.id}>
              <td>{artwork.id}</td>
              <td>
                <img
                  src={
                    artwork.image_url ||
                    'https://placehold.co/60x60/cccccc/000000?text=NO'
                  }
                  alt={artwork.name}
                  className={styles.thumbnail}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/60x60/cccccc/000000?text=Err';
                  }}
                />
              </td>
              <td>{artwork.name}</td>
              <td>${artwork.price?.toFixed(2)}</td>
              <td>
                <span
                  className={
                    artwork.stock > 0 ? styles.stockIn : styles.stockOut
                  }
                >
                  {artwork.stock}
                </span>
              </td>
              <td className={styles.actions}>
                <button
                  onClick={() => handleEdit(artwork)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(artwork.id, artwork.name)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && artworks.length > 0 && (
        <p className={styles.loadingSmall}>Actualizando...</p>
      )}
    </div>
  );
}
