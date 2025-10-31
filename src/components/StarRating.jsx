import React from "react";

export default function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          color: i <= rating ? "#FFD700" : "#ccc",
          fontSize: "1.2em",
        }}
      >
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
}
