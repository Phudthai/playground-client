"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import jsCookie from "js-cookie";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const ChatRoom = () => {
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    {
      is_avatar_message: boolean;
      message: string;
      suggested_messages: string;
      createdAt: Date;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/enduser/avatars/get-avatar",
        {
          headers: { authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      setUser(response.data.fullname);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/enduser/chats/all-rooms",
        {
          headers: { authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      setRooms(response.data.docs);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChats = async (room_id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/enduser/chats/get-chat/${room_id}`,
        {
          headers: { authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      setMessages(response.data.messages.docs);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const clearChat = async (room_id: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/enduser/chats/clear-chat/${room_id}`,
        {},
        {
          headers: { authorization: "Bearer " + jsCookie.get("accessToken") },
          withCredentials: true,
        }
      );
      setMessages([]);
      fetchChats(room_id);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchUser();

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("connect_error");
    };
  }, []);

  const handleRoomSelect = (room_id: string) => {
    setSelectedRoom(room_id);
    socket.emit("joinRoom", room_id);
    fetchChats(room_id);
  };

  const handleSendMessage = async () => {
    if (newMessage && selectedRoom) {
      const message = {
        message: newMessage,
        room_id: selectedRoom,
      };

      socket.emit("message", message, (acknowledgment: any) => {
        if (acknowledgment?.status === "ok") {
          setNewMessage("");
        } else {
          console.error("Message not sent:", acknowledgment?.error);
        }
      });
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 border-r shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Chat Rooms
        </h2>
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedRoom === room._id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleRoomSelect(room._id)}
              >
                {room._id} : {room.name}
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
              <p>Logged in as: {user}</p>
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

            {/* Chat Input */}
            <div className="bg-gray-200 p-4 border-t">
              <div className="flex items-center">
                <button
                  className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => clearChat(selectedRoom)}
                >
                  Clear Chat History
                </button>
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 text-black"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button
                  className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a room to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
