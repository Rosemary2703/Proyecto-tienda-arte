import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ProductCRUD.module.css';

/**
 * Formulario para crear o editar una obra de arte.
 * Compatible con la tabla "artworks" en Supabase.
 */
export default function ProductForm({ currentProduct, onClose, onSave }) {
  const isEditing = !!currentProduct;

  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
    category_id: 1, // puedes quitar esto si no lo usas
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si estamos editando, cargar los datos actuales
  useEffect(() => {
    if (isEditing && currentProduct) {
      setFormData({
        name: currentProduct.name || '',
        description: currentProduct.description || '',
        price: currentProduct.price || 0,
        stock: currentProduct.stock || 0,
        image_url: currentProduct.image_url || '',
        category_id: currentProduct.category_id || 1,
      });
    }
  }, [isEditing, currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock' || name === 'category_id'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        // 🔁 Actualizar obra existente
        const { error: updateError } = await supabase
          .from('artworks') // 👈 tabla real
          .update(formData)
          .eq('id', currentProduct.id);

        if (updateError) throw updateError;
      } else {
        // ➕ Crear nueva obra
        const { error: insertError } = await supabase
          .from('artworks') // 👈 tabla real
          .insert([formData]);

        if (insertError) throw insertError;
      }

      // Cerrar modal y refrescar lista
      onSave(true);
      onClose();
    } catch (err) {
      console.error('Error al guardar obra:', err);
      setError(
        `Error al ${isEditing ? 'actualizar' : 'crear'} la obra: ${
          err.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>
        {isEditing
          ? `Editar Obra: ${currentProduct.name}`
          : 'Añadir Nueva Obra'}
      </h3>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <label>Nombre de la Obra</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Descripción</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        required
      />

      <label>Precio ($)</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        min="0"
        step="0.01"
        required
      />

      <label>Stock</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        min="0"
        required
      />

      <label>URL de Imagen</label>
      <input
        type="url"
        name="image_url"
        value={formData.image_url}
        onChange={handleChange}
        required
      />

      {/* Puedes quitar este campo si no usas categorías */}
      <label>ID de Categoría</label>
      <input
        type="number"
        name="category_id"
        value={formData.category_id}
        onChange={handleChange}
        min="1"
      />

      <div className={styles.formActions}>
        <button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Guardando...'
            : isEditing
            ? 'Guardar Cambios'
            : 'Crear Obra'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
