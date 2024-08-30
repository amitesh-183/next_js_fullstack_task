"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProductList from "@/components/ProductList";
import Link from "next/link";
import axios from "axios";
import LottieAnimation from "@/components/Loader";

export default function DashboardPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const userRole = session.user.role.toLowerCase().replace(" ", "-");
      if (userRole !== params.role) {
        router.push(`/dashboard/${userRole}`);
      }
    }
  }, [status, router, session, params.role]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // You might want to add some error handling here, e.g., showing an error message to the user
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      loadProducts();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <>
        <LottieAnimation />
      </>
    );
  }

  if (!session) {
    return null; // or a loading indicator
  }

  const userRole = session.user.role.toLowerCase().replace(" ", "-");
  const isTeamMember = userRole === "team-member";

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{session.user.role} Dashboard</h1>
        {isTeamMember && (
          <Link href="/add-product" passHref>
            <button className="bg-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full duration-300">
              Add Product
            </button>
          </Link>
        )}
      </div>
      <ProductList products={products} userRole={userRole} />
    </div>
  );
}
