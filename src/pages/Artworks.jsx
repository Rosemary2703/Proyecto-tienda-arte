import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Pages.module.css";

export default function Artworks() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArtworks();
  }, []);

  // 🔹 Obtener obras desde Supabase
  const fetchArtworks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("id, title, price, image_url, description, rating, rating_count")
      .eq("is_active", true)
      .limit(10); // 🔹 Mostrar 10 obras en el catálogo completo

    if (error) {
      console.error(error);
      setError("No pudimos cargar las obras de arte.");
    } else {
      setArtworks(data || []);
    }
    setIsLoading(false);
  };

  // 🔍 Filtro por título, artista o categoría
  const filteredArtworks = artworks.filter((art) => {
    const term = search.toLowerCase();
    return (
      art.title.toLowerCase().includes(term) ||
      (art.artist && art.artist.toLowerCase().includes(term)) ||
      (art.category && art.category.toLowerCase().includes(term))
    );
  });

  if (isLoading) return <p>Cargando catálogo...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (artworks.length === 0) return <p>No hay obras disponibles.</p>;

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.pageTitle}>Catálogo Completo</h1>

      {/* 🔍 Buscador con estilo mejorado */}
      <input
        type="text"
        placeholder="Buscar por título, artista o categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {/* 🖼️ Grid de obras */}
      <div className={styles.productGrid}>
        {filteredArtworks.map((artwork) => (
          <div key={artwork.id} className={styles.artworkCard}>
            <ProductCard product={artwork} />
          </div>
        ))}
      </div>
    </div>
  );
}
