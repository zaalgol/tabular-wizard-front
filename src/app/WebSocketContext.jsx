
//     //v4 
//     // socketRef.current = io("http://localhost:8080/ws", {
//     //   transports: ["websocket"],
//     //   path: "/ws",
//     //   autoConnect: true,
//     // });

//     /// v5
//     // socketRef.current = io("http://localhost:8080/ws", {
//     //   transports: ["websocket"],
//     //   autoConnect: true,
//     // });
    
//     // socketRef.current = io("http://localhost:8080", {
//     //   transports: ["websocket"],
//     //   path: "/ws",
//     //   autoConnect: true, // Ensure correct casing
//     // });
    

// // src/app/WebSocketContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import io from "socket.io-client";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const socketRef = useRef(null);

  useEffect(() => {
    // Whenever `token` changes, tear down the old socket and make a new one
    if (socketRef.current) {
      socketRef.current.close();
      console.log("Closed existing socket");
    }

    if (token) {
      console.log("Creating socket for token:", token);
      socketRef.current = io("http://localhost:8080", {
        transports: ["websocket"],
        path: "/socket.io",
        auth: { token }
      });

      const socket = socketRef.current;

      socket.on("connect", () => {
        console.log("Connected with SID:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      socket.on("status", (message) => {
        console.log("Got status:", message);
        setMessages((prev) => [...prev, message]);

        if (message.status === "success" && message.file_url) {
          const downloadLink = document.createElement("a");
          downloadLink.href = `${message.file_url}?Authorization=${token}&model_name=${message.model_name}&file_type=${message.file_type}`;
          downloadLink.download = "download_file";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
    } else {
      // No token => not logged in => no socket
      console.log("No token found, not creating socket");
    }

    // Cleanup whenever the effect is about to re-run or unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  /**
   * Provide a function that allows us to re-set the token from anywhere
   * (e.g. on login or logout).
   */
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("access_token", newToken);
    } else {
      localStorage.removeItem("access_token");
    }
    setToken(newToken);
  };

  return (
    <WebSocketContext.Provider
      value={{ messages, token, setToken: updateToken }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
