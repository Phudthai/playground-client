"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const ChatRooms = () => {
  const [socket, setSocket] = useState<any>(null); // ใช้ any เป็นการชั่วคราว

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    return () => {
      console.log("Disconnecting socket...");
      socketInstance.disconnect();
    };
  }, []);

  const handleButtonClick = () => {
    if (socket) {
      socket.emit("btn_clicked", "user1");
    }
  };

  return (
    <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
      <button
        className="w-full text-left py-2 px-4 rounded-lg bg-gray-200"
        onClick={handleButtonClick}
      >
        Room 1
      </button>
    </div>
  );
};

export default ChatRooms;
