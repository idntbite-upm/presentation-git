import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

interface User {
  name: string;
  email: string;
}

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

// api.interceptors.request.use((config) => {
//   console.log("🚀 Request:", {
//     method: config.method?.toUpperCase(),
//     url: config.url,
//     headers: config.headers,
//     data: config.data,
//   });
//   return config;
// });
//
// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ Response:", {
//       status: response.status,
//       data: response.data,
//       headers: response.headers,
//     });
//     return response;
//   },
//   (error) => {
//     console.error("❌ Error:", {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       config: error.config,
//     });
//     return Promise.reject(error);
//   },
// );

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        );

        setUser(data);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.msg || "An error occurred"
            : "An error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        {user ? `Hello ${user.name}` : "Welcome to Auth App"}
      </header>
      <main className="flex flex-col items-center space-y-4">
        {!user ? (
          <>
            <Link
              href="/register"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-200"
          >
            Logout
          </button>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </main>
    </div>
  );
}
