
const STORAGE_KEY = "pure-delicacy-foods";

const initialFoods = [
  {
    id: 1,
    name: "Paneer Tikka",
    description: "Delicious grilled paneer with Indian spices.",
    price: 220,
    category: "Starter",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500"
  },
  {
    id: 2,
    name: "Veg Biryani",
    description: "Aromatic rice cooked with vegetables and spices.",
    price: 180,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500"
  },
  {
    id: 3,
    name: "Grilled Chicken",
    description: "Grilled chicken served with flavorful seasoning.",
    price: 280,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500"
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie for dessert lovers.",
    price: 120,
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500"
  }
];

function readFoods() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFoods));
  return initialFoods;
}

function saveFoods(foods) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
}

export const foodService = {
  async getAll() {
    return readFoods();
  },

  async create(food) {
    const foods = readFoods();
    const newFood = {
      ...food,
      id: Date.now()
    };

    saveFoods([...foods, newFood]);
    return newFood;
  },

  async update(id, updatedFood) {
    const foods = readFoods();
    const updated = foods.map((food) =>
      String(food.id) === String(id)
        ? { ...food, ...updatedFood, id: food.id }
        : food
    );

    saveFoods(updated);
    return updated.find((food) => String(food.id) === String(id));
  },

  async remove(id) {
    const foods = readFoods();
    saveFoods(
      foods.filter((food) => String(food.id) !== String(id))
    );

    return true;
  }
};
