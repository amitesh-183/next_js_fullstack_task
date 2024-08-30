'use client';

import AuthForm from '@/components/AuthForm';

const RegisterPage = () => {
  return (
    <div className=" flex items-center justify-center">
      <div className="bg-white p-8 rounded text-gray-900 w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <AuthForm type="register" />
      </div>
    </div>
  );
};

export default RegisterPage;
