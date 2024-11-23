"use client";
import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { requestFDMToken } from "../../lib/firebase"; // Import ฟังก์ชันสร้าง FCM Token

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fcmToken, setFcmToken] = useState<string>("");

  // สร้าง FCM Token เมื่อ Component ถูกโหลด
  useEffect(() => {
    requestFDMToken().then((token) => {
      if (token) {
        setFcmToken(token);
      }
    });
  }, []);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle login logic here
  //   console.log({ email, password });
  // };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/enduser/auths/login",
        {
          provider: "670f8bf9ae0130e32096c80a",
          email,
          password,
          rememberMe: true,
          fcm_token: fcmToken, // ส่ง FCM Token
        },
        {
          withCredentials: true,
        }
      );
      Cookies.set("accessToken", res.data.accessToken);
      Cookies.set("refreshToken", res.data.refreshToken, {
        expires: res.data.refreshExpiresIn,
      });
      console.log("Login successful:", res.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const fetchUserProfile = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3000/api/auths/backoffice/me",
  //       { withCredentials: true }
  //     );
  //     window.location.href = "/me";
  //   } catch (error: unknown) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       if (error.response.status === 401) {
  //         await axios
  //           .post(
  //             "http://localhost:3000/api/auths/backoffice/refresh-token",
  //             {},
  //             { withCredentials: true }
  //           )
  //           .then(async (response) => {
  //             await axios.get("http://localhost:3000/api/auths/backoffice/me", {
  //               withCredentials: true,
  //             });
  //             window.location.href = "/me";
  //           })
  //           .catch((error) => {
  //             console.error("Error refreshing token", error);
  //           });
  //       } else {
  //         console.error("Error fetching user profile", error);
  //       }
  //     } else {
  //       console.error("Error fetching user profile", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUserProfile();
  // }, []);

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

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
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
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
        </div>
      </div>
    </>
  );
}
