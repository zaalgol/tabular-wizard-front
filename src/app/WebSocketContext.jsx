// src/app/WebSocketContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io from "socket.io-client";
import appConfig from "../config/config.json";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // local
    socketRef.current = io(
      // `${appConfig.SERVER_ADDRESS}:${appConfig.SERVER_PORT}`,
      // v7
      // "http://localhost:8080",
      // {
      //   transports: ["websocket"],
      //   path: "/socket.io",
      //   autoConnect: true,
      // }
    );

    //v4 
    socketRef.current = io("http://localhost:8080/ws", {
      transports: ["websocket"],
      path: "/ws",
      autoConnect: true,
    });

    /// v5
    // socketRef.current = io("http://localhost:8080/ws", {
    //   transports: ["websocket"],
    //   autoConnect: true,
    // });
    
    // socketRef.current = io("http://localhost:8080", {
    //   transports: ["websocket"],
    //   path: "/ws",
    //   autoConnect: true, // Ensure correct casing
    // });
    

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    socket.on("status", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (message["status"] === "success" && message["file_url"]) {
        console.log(`message["file_url"]:${message["file_url"]}`);
        // If the message has a CSV URL, prompt the user to download the file
        const downloadLink = document.createElement("a");
        const token = localStorage.getItem("access_token");
        downloadLink.href = `${message["file_url"]}?Authorization=${token}&model_name=${message["model_name"]}&file_type=${message["file_type"]}`;    
        console.log(`message["file_url"]:${message["file_url"]}`);
        console.log(`downloadLink.href:${downloadLink.href}`);
        downloadLink.download = "download_file";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    });

    return () => {
      if (socket) {
        socket.close();
        console.log("Disconnected from Socket.IO server");
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};
