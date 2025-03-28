import { useEffect } from "react";
import axios from "axios";

const CreateProductOnLoad = () => {
  useEffect(() => {
    const createTestProduct = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:2999/api/create-product", {
          title: "Test Product",
          price: 25.99,
          description: "Just a test product",
          image: "https://via.placeholder.com/150",
          category: "test-category"
        });

        console.log("Product created:", response.data);
      } catch (error) {
        console.error("Failed to create product:", error);
      }
    };

    createTestProduct(); // ⬅️ Call it immediately on mount
  }, []); // Empty dependency array = run only once on component mount

  return (
    <div>
      <h1>Creating Product...</h1>
    </div>
  );
};

export default CreateProductOnLoad;