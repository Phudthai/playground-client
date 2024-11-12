"use client";

import { useEffect, useState } from "react";
import { requestFDMToken } from "../../lib/firebase";
import axios from "axios";

const FcmPage = () => {
  const [fcmToken, setFcmToken] = useState<string>("");

  const sendNotification = async () => {
    console.log(fcmToken);
    try {
      const response = await axios.post(
        "http://localhost:3000/send-notification",
        {
          title: "test",
          body: "test",
          token: fcmToken,
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // ตรวจสอบว่ากำลังรันโค้ดนี้บน client-side เท่านั้น
    if (typeof window !== "undefined") {
      requestFDMToken().then((token) => {
        if (token) {
            setFcmToken(token);
        //   const response = axios.post(
        //     "http://localhost:5000/send-notification",
        //     {
        //       title: "test",
        //       body: "test",
        //       token: token,
        //     }
        //   );
        //   console.log(response);
        }
      });
    }
  }, []);

  return (
    <div>
      <h1>FCM Push Notifications</h1>
      <p>
        This page manages Firebase Cloud Messaging (FCM) for push notifications.
      </p>
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default FcmPage;
