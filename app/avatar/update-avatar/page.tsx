"use client";

import React, { useState } from "react";
import axios from "axios";
import jsCookie from "js-cookie";

const UpdateAvatarImage: React.FC = () => {
  const [avatarId, setAvatarId] = useState(""); // Avatar ID ที่จะอัปเดต
  const [avatarInfo, setAvatarInfo] = useState({
    fullname: "",
    location: "",
    date_of_birth: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // จัดการการเปลี่ยนแปลงในฟิลด์ avatarInfo
  const handleAvatarInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAvatarInfo({
      ...avatarInfo,
      [name]: value,
    });
  };

  // จัดการการเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarId) {
      setMessage("Please provide a valid avatar ID.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar_info", JSON.stringify(avatarInfo));
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post(`http://localhost:3000/api/enduser/avatars/update-avatar/${avatarId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" ,
            authorization: "Bearer " + jsCookie.get("accessToken")
         },
        withCredentials: true,
      });
      setMessage("Avatar updated successfully!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to update avatar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Update Avatar</h2>
        {message && <p className="mb-4 text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Avatar ID</label>
            <input
              type="text"
              name="avatarId"
              className="w-full p-2 border rounded"
              value={avatarId}
              onChange={(e) => setAvatarId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              className="w-full p-2 border rounded"
              value={avatarInfo.fullname}
              onChange={handleAvatarInfoChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border rounded"
              value={avatarInfo.location}
              onChange={handleAvatarInfoChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              className="w-full p-2 border rounded"
              value={avatarInfo.date_of_birth}
              onChange={handleAvatarInfoChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              className="w-full p-2 border rounded"
              value={avatarInfo.address}
              onChange={handleAvatarInfoChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input type="file" name="profile_image" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Avatar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAvatarImage;
