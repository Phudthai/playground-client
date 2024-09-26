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

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFDMToken = async () => {
  return Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        return getToken(messaging, {
          vapidKey: vapidKey,
        });
      } else {
        return new Error("Permission not granted");
      }
    })
    .catch((error) => {
      console.log("Error getting FCM token", error);
      return new Error(error);
    });
};
