import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useEffect } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ username, password });
  };

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:3000/api/auths/backoffice/login", {
        username,
        password,
        rememberMe: true,
      },{
        withCredentials: true
      });
      window.location.href = "/me";
    } catch (error) {
      console.error(error);
    }
  };

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auths/backoffice/me",
          { withCredentials: true }
        );
        window.location.href = "/me";
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 401) {
            await axios
              .post(
                "http://localhost:3000/api/auths/backoffice/refresh-token",
                {},
                { withCredentials: true }
              )
              .then(async (response) => {
                const reResponse = await axios.get(
                  "http://localhost:3000/api/auths/backoffice/me",
                  { withCredentials: true }
                );
                window.location.href = "/me";
              })
              .catch((error) => {
                console.error("Error refreshing token", error);
              });
          } else {
            console.error("Error fetching user profile", error);
          }
        } else {
          console.error("Error fetching user profile", error);
        }
      }
    };

    useEffect(() => {
      fetchUserProfile();
    }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
            <div className="mt-4 text-center">
              <a href="#" className="text-indigo-500 hover:underline text-sm">
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
