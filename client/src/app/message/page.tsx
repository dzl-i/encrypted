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
  const [messages, setMessages] = useState<{
    id: string;
    senderId: string;
    message: string;
    timeSent: Date;
    dmId: string;
  }[]>([]); // messages for the current DM

  const [socket, setSocket] = useState<Socket | null>(null); // Add this state

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && message !== "") {
      sendMessage(e);
    }
  };

  // Handling Socket.io
  useEffect(() => {
    const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      withCredentials: true
    });
    setSocket(socketConnection);

    socketConnection.on('receive_dm_message', (receivedMessage) => {
      console.log(receivedMessage)
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Sending the message
  const sendMessage = (e) => {
    e.preventDefault();
    if (message !== "" && socket && activeDm) {
      socket.emit('send_dm_message', activeDm, message, (acknowledgedMessage) => {
        // The server should send back the saved message object as acknowledgement
        if (acknowledgedMessage && acknowledgedMessage.id) {
          setMessages((prevMessages) => [...prevMessages, acknowledgedMessage]);
        }
      });
      setMessage('');
    }
  };


  // Automatically scroll to newest message
  useEffect(() => {
    const lastMessage = document.querySelector("#lastMessage");
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // When the active DM changes, join the new DM room and leave the previous room.
  useEffect(() => {
    if (socket && activeDm) {
      socket.emit('join', activeDm);

      // Fetch previous messages of the DM
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dm/messages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dmId: activeDm
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            setMessages(data.messages);
          }
        })
        .catch(error => {
          console.error("Error fetching messages for DM", activeDm, error);
        });
    }
  }, [activeDm, socket]);

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
                    {msg.message}
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
