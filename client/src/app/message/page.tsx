"use client"

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import io, { Socket } from 'socket.io-client';

import { NavBar } from "@/components/NavbarProtected";
import { DmListSidebar } from '@/components/DmListSidebar';

export default function Page() {
  // const [dms, setDms] = useState([]); // List of DMs
  const [activeDm, setActiveDm] = useState(''); // Currently viewed DM

  const [message, setMessage] = useState(''); // message input
  const [messages, setMessages] = useState<string[]>([]); // messages for the current DM

  const [chat, setChat] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null); // Add this state

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && message !== "") {
      sendMessage(e);
    }
  };

  useEffect(() => {
    const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}`);
    setSocket(socketConnection);

    socketConnection.on('receive_message', (data) => {
      console.log("Received message:", data);
      setChat(prevChat => [...prevChat, data.message]);
    });

    socketConnection.on('receive_dm_message', (receivedMessage) => {
      console.log(receivedMessage)
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    // When the active DM changes, join the new DM room and leave the previous room.
    if (socket && activeDm) {
      socket.emit('join', activeDm);
    }
  }, [activeDm, socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "" && socket && activeDm) {
      socket.emit('send_dm_message', activeDm, message);
      setMessage('');
    }
  };

  const handleSetActiveDm = (id) => {
    setActiveDm(id);
  };

  return (
    <main className="flex flex-col min-h-screen dark">
      <NavBar />

      <div className="flex flex-row flex-grow mt-20">
        <DmListSidebar activeDm={activeDm} onDmClick={handleSetActiveDm} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: '100%', minHeight: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)", padding: "0.5rem" }}>
            <h3>Chatroom</h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, overflowY: 'scroll' }}>
                {messages.map((msg, idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={handleKeyDown} />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
