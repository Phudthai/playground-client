import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBU1hEocfUIEcbpJjuwhr8HhpCdjgRJhC0",
  authDomain: "hc-health-care.firebaseapp.com",
  projectId: "hc-health-care",
  storageBucket: "hc-health-care.appspot.com",
  messagingSenderId: "77735978779",
  appId: "1:77735978779:web:799138e7e47b66f99655be",
  measurementId: "G-HV6YXP8PNL",
};

const vapidKey =
  "BAV4_7qR9jubPMjx-boCZzztmGStZrGskg5U2ucG1a_JDyrnnHoye50NrNnrsV_2trzdyna5dR6iMz-BoYpygi8";

// Initialize Firebase app only on client-side
const app = initializeApp(firebaseConfig);

let messaging = null;

// ตรวจสอบให้แน่ใจว่าโค้ดนี้จะรันเฉพาะในเบราว์เซอร์เท่านั้น
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  messaging = getMessaging(app);
}

export const requestFDMToken = async () => {
  if (messaging) {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey,
      });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } catch (err) {
      console.log("An error occurred while retrieving token. ", err);
      return null;
    }
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Message received: ", payload);
        resolve(payload);
      });
    }
  });
