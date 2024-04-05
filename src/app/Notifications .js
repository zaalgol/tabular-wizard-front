import React, { useState, useEffect } from 'react';
import { useWebSocket } from './WebSocketContext'; // Adjust the import path as needed
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

const Notifications = () => {
    const { messages } = useWebSocket();
    const [currentMessage, setCurrentMessage] = useState('');
    const [open, setOpen] = React.useState(true);

    // When a new message is received, show the modal
    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            setCurrentMessage(latestMessage.message);
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [messages]);

    return (
        <Collapse in={open}>
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert
                variant="filled"
                severity="success"
                action={
                    <Button 
                    color="inherit"
                     size="small"
                     onClick={() => {
                        setCurrentMessage('');
                        setOpen(false);
                      }}>
                        Close
                    </Button>
                }>
                {currentMessage}
            </Alert>

        </Stack>
        </Collapse>
    );
};

export default Notifications;
