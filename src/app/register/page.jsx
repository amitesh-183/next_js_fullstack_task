"use client";

import AuthForm from "@/components/AuthForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-[url('/images/auth.jpg')] bg-cover flex items-center justify-center bg-gray-100">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border p-10 text-white shadow-md shadow-black/40 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">Register</h1>
        <AuthForm type="register" />
        <p className="text-sm text-center pt-3">
          Already have an account ?{" "}
          <Link href="/login" className=" text-pink-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
