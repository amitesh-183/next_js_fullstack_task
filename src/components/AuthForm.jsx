import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const AuthForm = ({ type }) => {
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase().replace(" ", "-");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Team member");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "register") {
      try {
        const response = await axios.post("api/register", {
          name,
          email,
          password,
          role,
        });
        if (response.status === 201) {
          toast.success("Registration successful");
          router.push("/login");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } else {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful");
        router.push(`/dashboard/${userRole}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded bg-transparent text-white placeholder:text-white/60"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded bg-transparent text-white placeholder:text-white/60"
        required
      />
      {type === "register" && (
        <div className=" radio-input">
          <h5 className="text-white">Select role</h5>
          <div className="flex gap-4">
            <label className="flex items-center text-white label">
              <input
                type="radio"
                value="Team member"
                checked={role === "Team member"}
                onChange={() => setRole("Team member")}
                className="mr-2"
              />
              Team member
            </label>
            <label className="flex items-center text-white label">
              <input
                type="radio"
                value="Admin"
                checked={role === "Admin"}
                onChange={() => setRole("Admin")}
                className="mr-2"
              />
              <p>Admin</p>
            </label>
          </div>
        </div>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-pink-500 hover:bg-pink-700 duration-300 rounded-full text-white"
      >
        {type === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;
