import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  bg-[url('/images/home.jpg')] bg-cover bg-left-top bg-no-repeat">
      <div className=" max-w-6xl mx-auto w-full">
        <h1 className="text-7xl font-black  text-white">
          Supercharge Your Team Management with Processor-Speed Efficiency
        </h1>
        <p className="text-white max-w-2xl py-6">
          Unleash the full potential of your team with a platform designed to
          operate at the speed of a processor. Experience seamless
          collaboration, lightning-fast task management, and streamlined
          workflows that keep you ahead of the curve.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="bg-blue-500 text-white hover:border-white hover:bg-blue-600 duration-300 border border-transparent px-20 py-2 rounded-full"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
