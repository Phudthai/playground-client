"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

interface UserProfile {
  username: string;
  fullname: string;
  role_name: string;
  avatarUrl: string;
}

export default function MePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auths/backoffice/me",
        { withCredentials: true }
      );
      setUserProfile({
        fullname: response.data.user_id.fullname,
        username: response.data.username,
        role_name: response.data.user_id.role.role_name,
        avatarUrl: "https://i.pravatar.cc/300",
      });
      console.log(response.data);
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

              setUserProfile({
                fullname: reResponse.data.user_id.fullname,
                username: reResponse.data.username,
                role_name: reResponse.data.user_id.role.role_name,
                avatarUrl: "https://i.pravatar.cc/300",
              });
            })
            .catch((error) => {
              window.location.href = "/signin";
            });
        } else {
          console.error("Error fetching user profile", error);
        }
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auths/backoffice/logout",
        {},
        {
          withCredentials: true,
        }
      );
      window.location.href = "/signin";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-center">
          <img
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover shadow-lg"
            src={userProfile?.avatarUrl}
            alt="User Avatar"
          />
        </div>
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {userProfile?.fullname}
          </h2>
          <p className="text-gray-500">@{userProfile?.username}</p>
          <p className="mt-2 text-gray-700 font-semibold">
            {userProfile?.role_name}
          </p>
        </div>
        <div className="mt-8 flex justify-between space-x-4">
          <button className="bg-indigo-500 text-white w-full py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300">
            Edit Profile
          </button>
          <button
            className="bg-red-500 text-white w-full py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
