
const API_URL = "http://localhost:5000/foods";

export const foodService = {
  async getAll() {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
  async create(food) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(food),
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
  async update(id, food) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(food),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
  async remove(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  },
};
export async function testAPI() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("API connected successfully:", data);
  } catch (error) {
    console.error("API connection failed:", error);
  }
}