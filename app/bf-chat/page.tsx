"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import jsCookie from "js-cookie";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const BackOfficeChat = () => {
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { message: string; is_avatar_message: boolean; createdAt: Date }[]
  >([]);

  useEffect(() => {
    // เชื่อมต่อ Socket
    socket.on("connect", () => {
      console.log("Back Office connected:", socket.id);
    });

    // ฟัง event 'message' เพื่อดูข้อความแบบ Real-time
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    // ดึงห้องแชทจาก API
    fetchRooms();

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("connect_error");
    };
  }, []);

  const fetchRooms = async () => {
    const avatar_id = localStorage.getItem("avatar_id");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/backoffice/chats/all-rooms/${avatar_id}`,
        {
          headers: { Authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchChats = async (room_id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/backoffice/chats/get-messages/${room_id}`,
        {
          headers: { Authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      console.log(response.data.docs);
      setMessages(response.data.docs);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleRoomSelect = (room_id: string) => {
    setSelectedRoom(room_id);
    setMessages([]); // ล้างข้อความก่อนหน้า
    socket.emit("joinRoom", room_id);
    fetchChats(room_id);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar: รายการห้องแชท */}
      <div className="w-1/4 bg-white p-4 border-r shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Back Office - Chat Rooms
        </h2>
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                onClick={() => handleRoomSelect(room._id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedRoom === room._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
              <h2 className="text-xl font-semibold">Room: {selectedRoom}</h2>
              <p className="italic">View-only mode</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    msg.is_avatar_message ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`max-w-lg px-4 py-2 rounded-lg shadow-md ${
                      msg.is_avatar_message
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <span className="ml-2 text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Disabled Input */}
            <div className="bg-gray-200 p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none bg-gray-100 text-gray-500"
                  placeholder="View-only mode: cannot send messages"
                  disabled
                />
                <button
                  className="ml-4 px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  disabled
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a room to view chats.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default BackOfficeChat;
