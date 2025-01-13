"use client";

import React, { useState } from "react";
import axios from "axios";
import jsCookie from "js-cookie";

const UploadAvatar: React.FC = () => {
  const [avatarInfo, setAvatarInfo] = useState({
    fullname: "",
    location: "",
    date_of_birth: "",
    address: "",
    is_agreed_terms: false,
    is_agreed_privacy: false,
    is_agreed_ai_ml: false,
  });

  const [onboarding, setOnboarding] = useState({
    goal_for_this_app: "",
    age: "",
    gender: "",
    height: { type: "Cm", value: "" },
    weight: { type: "lbs", value: "" },
    blood_type: "",
    blood_group: "",
    rate_fitness_level: 0,
    chronic_health_condition: [],
    drug_allergy: [],
    specific_wellness_goal: [],
    medical_history: "",
    diagnosis_history: [],
    family_diseases: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // จัดการฟิลด์ avatarInfo
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setAvatarInfo({
      ...avatarInfo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // จัดการฟิลด์ onboarding
  const handleOnboardingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split("."); // สำหรับการอัปเดต nested object
    if (keys.length === 2) {
      setOnboarding({
        ...onboarding,
        [keys[0]]: {
          ...onboarding[keys[0]],
          [keys[1]]: value,
        },
      });
    } else {
      setOnboarding({ ...onboarding, [name]: value });
    }
  };

  // จัดการการเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  // จัดการส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileImage) {
      setMessage("Please upload a profile image.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar_info", JSON.stringify(avatarInfo));
    formData.append("onboarding", JSON.stringify(onboarding));
    formData.append("profile_image", profileImage);

    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post("https://api.dev.healthymax.co/api/enduser/avatars/create-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data",
            authorization: "Bearer " + jsCookie.get("accessToken")
         },
        withCredentials: true,
      });
      setMessage("Avatar uploaded successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload avatar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Upload Avatar</h2>
        {message && <p className="mb-4 text-center text-red-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              className="w-full p-2 border rounded"
              value={avatarInfo.fullname}
              onChange={handleAvatarChange}
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
              onChange={handleAvatarChange}
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
              onChange={handleAvatarChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              name="height.value"
              className="w-full p-2 border rounded"
              value={onboarding.height.value}
              onChange={handleOnboardingChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blood Type</label>
            <input
              type="text"
              name="blood_type"
              className="w-full p-2 border rounded"
              value={onboarding.blood_type}
              onChange={handleOnboardingChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input type="file" name="profile_image" onChange={handleFileChange} required />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_agreed_terms"
              onChange={handleAvatarChange}
              checked={avatarInfo.is_agreed_terms}
              required
            />
            <label>I agree to the terms</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Avatar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAvatar;
