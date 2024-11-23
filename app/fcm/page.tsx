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
    if (typeof window !== "undefined") {
      requestFDMToken().then((token) => {
        if (token) {
            setFcmToken(token);
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
