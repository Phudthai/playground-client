"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const ChatRoom = () => {
  const [rooms, setRooms] = useState<{ _id: string; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<string | null>(null);

  // ฟังก์ชันดึงห้องแชททั้งหมด
  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/rooms/all-rooms"
      );
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ฟังก์ชันดึงประวัติแชทจาก API
  const fetchChats = async (roomId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chats/${roomId}`
      );
      setMessages(response.data.messages); // อัปเดตสถานะ messages ด้วยข้อมูลจาก API
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    setUser(localStorage.getItem("userName") || "Anonymous");
    fetchRooms();

    // ฟัง event 'message' จาก Socket.IO
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  // ฟังก์ชันสำหรับเลือกห้องและดึงประวัติแชท
  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    socket.emit("joinRoom", roomId);
    fetchChats(roomId); // ดึงข้อมูลแชทของห้องนี้
  };

  // ฟังก์ชันสำหรับส่งข้อความ
  const handleSendMessage = async () => {
    if (newMessage && selectedRoom) {
      const message = {
        sender: user, // เปลี่ยนเป็นชื่อผู้ใช้จริงได้
        message: newMessage,
        roomId: selectedRoom,
      };

      // ส่งข้อความไปยัง Socket.IO
      socket.emit("message", message, (acknowledgment: any) => {
        if (acknowledgment?.status === "ok") {
          setNewMessage(""); // เคลียร์ข้อความที่พิมพ์
        } else {
          console.error("Message not sent:", acknowledgment?.error);
        }
      });
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                className="w-full text-left py-2 px-4 rounded-lg bg-gray-200"
                onClick={() => handleRoomSelect(room._id)}
              >
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4 bg-gray-100 rounded-lg shadow-md">
        {selectedRoom ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Chat Room</h2>
            <div className="h-64 overflow-y-auto border border-gray-300 p-2 mb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{ textAlign: msg.sender === user ? "right" : "left" }}
                >
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              ))}

              {/* {messages.map((msg, index) => (
                <div key={index}>
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
              ))} */}
            </div>

            <input
              type="text"
              className="border p-2 w-full"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="bg-blue-500 text-white p-2 mt-2"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </>
        ) : (
          <p>Select a room to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
