import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import styles from "../styles/Pages.module.css";
import StarRating from "../components/StarRating"; // 🔹 Importa tu componente de estrellas

export default function Home() {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  const fetchFeaturedArtworks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("artworks")
      .select("id, title, price, image_url, description, rating, rating_count")
      .eq("is_active", true)
      .order("rating", { ascending: false }) // 🔹 Muestra las mejores calificadas primero
      .limit(5); // 🔹 Solo 5 obras destacadas

    setIsLoading(false);

    if (error) {
      console.error(error);
      setError("No pudimos cargar las obras destacadas.");
    } else {
      setArtworks(data);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.pageTitle}>Galería en Línea</h1>

      {isLoading && <p>Cargando obras... 🎨</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* 🔹 Grid principal de tarjetas */}
      <div className={styles.cardsContainer}>
        {artworks.map((art) => (
          <div key={art.id} className={styles.artworkCard}>
            <img
              src={art.image_url}
              alt={art.title}
              className={styles.artworkImage}
            />
            <h3 className={styles.artworkTitle}>{art.title}</h3>
            <p className={styles.artworkPrice}>
              {art.price ? `$${art.price.toLocaleString()}` : "Sin precio"}
            </p>

            {/* ⭐ Calificación de usuarios */}
            <div className={styles.starWrapper}>
              <StarRating rating={art.rating || 0} />
              <p className={styles.ratingCount}>
                ({art.rating_count || 0} valoraciones)
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Botón inferior */}
      <div className={styles.viewMoreWrapper}>
        <Link to="/artworks" className={styles.viewMoreButton}>
          Ver catálogo completo →
        </Link>
      </div>
    </div>
  );
}
