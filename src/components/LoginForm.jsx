'use client';

import { signIn } from 'next-auth/react';
import AuthForm from '@/components/AuthForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <AuthForm type="login" />
        <div className="mt-4">
          <button
            onClick={() => signIn('google')}
            className="w-full p-2 bg-red-500 text-white rounded mb-2"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn('github')}
            className="w-full p-2 bg-gray-800 text-white rounded"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
