
function Card({ food }) {
  const category = food.category?.trim() || "Other";

  const badgeClass =
    category.toLowerCase() === "veg"
      ? "text-bg-success"
      : category.toLowerCase() === "non-veg"
        ? "text-bg-danger"
        : "text-bg-secondary";
  const imageUrl =
    food.imglink?.trim() ||
    "https://placehold.co/600x400?text=Food";
  const price = Number(food.price);
  return (
    <article className="card food-card h-100">
      <img
        src={imageUrl}
        className="card-img-top food-image"
        alt={food.name || "Food item"}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src =
            "https://placehold.co/600x400?text=Food";
        }}
      />
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h2 className="h5 card-title mb-0">
            {food.name}
          </h2>
          <span className={`badge ${badgeClass}`}>
            {category}
          </span>
        </div>
        <p className="food-price mb-0">
          {Number.isFinite(price)
            ? `₹${price.toFixed(2)}`
            : "Price unavailable"}
        </p>
      </div>
      <div className="card-footer">
        <small className="text-body-secondary">
          Food Menu
        </small>
      </div>
    </article>
  );
}

export default Card;
