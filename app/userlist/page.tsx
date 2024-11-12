"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserListPage() {
  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/backoffice/users/users-list?page=1",
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "anyValue",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);
  return <div>UserListPage</div>;
}
