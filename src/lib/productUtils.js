import axios from "axios";

// Fetch all products
export async function fetchProducts() {
  try {
    const response = await axios.get(
      "https://64e0caef50713530432cafa1.mockapi.io/api/products"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Fetch a single product by ID
export async function fetchProductById(id) {
  try {
    const response = await axios.get(
      `https://64e0caef50713530432cafa1.mockapi.io/api/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

// Update a product (for team members submitting changes)
export async function updateProduct(id, updatedData) {
  try {
    const response = await axios.put(
      `https://64e0caef50713530432cafa1.mockapi.io/api/products/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
}

// Create a new product (if needed)
export async function createProduct(productData) {
  try {
    const response = await axios.post(
      "https://64e0caef50713530432cafa1.mockapi.io/api/products",
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Delete a product (if needed)
export async function deleteProduct(id) {
  try {
    await axios.delete(
      `https://64e0caef50713530432cafa1.mockapi.io/api/products/${id}`
    );
    return true;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    return false;
  }
}
