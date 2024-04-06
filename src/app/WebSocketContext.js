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
            if (message["status"] === 'success' && message["csv_url"]) {
                // If the message has a CSV URL, prompt the user to download the file
                const downloadLink = document.createElement('a');
                // downloadLink.href = message["csv_url"];
                const token = localStorage.getItem('access_token');
                downloadLink.href = `${message["csv_url"]}?Authorization=${token}&model_name=${message["model_name"]}`;
                downloadLink.download = 'dataset.csv';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }
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
