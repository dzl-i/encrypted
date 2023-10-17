"use client"

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import io, { Socket } from 'socket.io-client';

import { NavBar } from "@/components/NavbarProtected";

export default function Page() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null); // Add this state

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && message !== "") {
      sendMessage(e);
    }
  };

  useEffect(() => {
    const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}`); // Instantiate socket inside useEffect
    setSocket(socketConnection); // Set the socket to state

    socketConnection.on('receive_message', (data) => {
      console.log("Received message:", data);
      setChat(prevChat => [...prevChat, data.message]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "" && socket) { // Check for socket before emitting
      socket.emit('send_message', { message: message });
      setMessage('');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%' }}>
        <Card style={{ width: '400px', padding: "0.5rem" }}>
          <h3>Chatroom</h3>
          <div style={{ height: '300px', overflowY: 'scroll' }}>
            {chat.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={handleKeyDown} />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
