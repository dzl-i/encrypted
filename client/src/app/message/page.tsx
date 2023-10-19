"use client"

import { useState, useEffect } from 'react';
import { Button, Input, Card, User, Divider } from '@nextui-org/react';
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

  useEffect(() => {
    const lastMessage = document.querySelector("#lastMessage");
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          <Card style={{ width: '100%', minHeight: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)", padding: "0.5rem", borderRadius: 0 }}>
            <Card shadow='none' style={{ display: "flex", flexDirection: "row", padding: "1rem" }}>
              <User
                name="John Smith"
                description="@mynameisjohn"
                avatarProps={{
                  src: "https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg"
                }}
              />
            </Card>
            <Divider />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxHeight: "calc(100vh - 240px)" }}>
              <div style={{ flex: 1, overflowY: 'scroll' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} id={idx === messages.length - 1 ? "lastMessage" : ""}>
                    {msg}
                  </div>
                ))}
              </div>
              <Card style={{ display: 'flex', flexDirection: "row", gap: '15px', position: "fixed", left: "20%", bottom: 0, width: "80%", padding: "1rem", backgroundColor: "#202020", borderRadius: 0 }}>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={handleKeyDown} />
                <Button onClick={sendMessage}>Send</Button>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
