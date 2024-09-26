// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyBU1hEocfUIEcbpJjuwhr8HhpCdjgRJhC0",
  authDomain: "hc-health-care.firebaseapp.com",
  projectId: "hc-health-care",
  storageBucket: "hc-health-care.appspot.com",
  messagingSenderId: "77735978779",
  appId: "1:77735978779:web:799138e7e47b66f99655be",
  measurementId: "G-HV6YXP8PNL",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
