import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize WebSocket connection
        const newSocket = io(`http://localhost:8080`); // Adjust server URL accordingly
        setSocket(newSocket);

        newSocket.on('status', message => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};
