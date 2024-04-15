import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import appConfig from '../config/config.json';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null); // Use useRef here

    useEffect(() => {
        // Initialize WebSocket connection
        socketRef.current = io(`${appConfig.SERVER_ADDRESS}:${appConfig.SERVER_PORT}`);
        
        const socket = socketRef.current;
        socket.on('status', message => {
            setMessages(prevMessages => [...prevMessages, message]);
            if (message["status"] === 'success' && message["csv_url"]) {

                // If the message has a CSV URL, prompt the user to download the file
                const downloadLink = document.createElement('a');
                const token = localStorage.getItem('access_token');
                downloadLink.href = `${message["csv_url"]}?Authorization=${token}&model_name=${message["model_name"]}`;
                downloadLink.download = 'dataset.csv';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        });

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};
