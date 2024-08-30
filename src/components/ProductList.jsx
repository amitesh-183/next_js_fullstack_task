"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ProductList({ products, userRole }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Link
            href={`${
              userRole === "team-member"
                ? `/edit-product/${product._id}`
                : `/product/${product._id}`
            }`}
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover aspect-square"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">
                ${parseFloat(product.price).toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {product.description.substring(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
