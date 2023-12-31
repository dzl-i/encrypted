"use client"

import { useState, useEffect } from 'react';
import { Button, Input, Card, User, Divider, CardHeader, CardBody } from '@nextui-org/react';
import io, { Socket } from 'socket.io-client';

import { NavBar } from "@/components/NavbarProtected";
import { DmListSidebar } from '@/components/DmListSidebar';
import { DmCreate } from '@/components/DmCreate';
import { decryptMessage, encryptMessage, importEncryptedAESKey } from '@/util/crypto';

type Dm = {
  id: string;
  dmName: string;
};

export default function Page() {
  const [dms, setDms] = useState<Dm[]>([]);
  const [activeDm, setActiveDm] = useState(''); // Currently viewed DM

  const [message, setMessage] = useState(''); // Message input
  const [messages, setMessages] = useState<{
    id: string;
    senderHandle: string;
    message: string;
    timeSent: Date;
    dmId: string;
  }[]>([]); // Messages for the current DM

  const [socket, setSocket] = useState<Socket | null>(null);

  const [showDmCreate, setShowDmCreate] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const [friendFullName, setFriendFullName] = useState<string>('');
  const [friendHandle, setFriendHandle] = useState<string>('');

  const [aesKey, setAESKey] = useState<CryptoKey>();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && message !== "") {
      sendMessage(e);
    }
  };

  // Sending the message
  const sendMessage = async (e) => {
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

  // Refreshing tokens
  const authRefresh = async () => {
    try {
      // Make a request to the /auth/refresh route to refresh the token
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  useEffect(() => {
    // Start the interval to refresh token every 14 minutes
    const refreshInterval = setInterval(authRefresh, 14 * 60 * 1000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Handling Socket.io
  useEffect(() => {
    const socketConnection = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      withCredentials: true
    });
    setSocket(socketConnection);

    const userHandle = sessionStorage.getItem("userHandle");
    if (userHandle) {
      // Emit the join event with the fetched ID
      socketConnection.emit('join', userHandle);
    }

    socketConnection.on('receive_dm_message', (receivedMessage) => {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // Handle new_dm_created event
    socketConnection.on('new_dm_created', () => {
      setTrigger(prev => !prev);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // Automatically scroll to newest message
  useEffect(() => {
    const lastMessage = document.querySelector("#lastMessage");
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // When the active DM changes, join the new DM room and leave the previous room.
  useEffect(() => {
    const fetchMessages = async () => {
      if (socket && activeDm) {
        socket.emit('join', activeDm);

        try {
          // Fetch previous messages of the DM
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dm/messages`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dmId: activeDm
            }),
          });

          const data = await response.json();
          if (data.messages) {
            setMessages(data.messages);
            setFriendFullName(data.friendFullName);
            setFriendHandle(data.friendHandle);

            setAESKey(await importEncryptedAESKey(data.aesKey));
          }
        } catch (error) {
          console.error("Error fetching messages for DM", activeDm, error);
        }
      }
    };

    fetchMessages();
  }, [activeDm, socket]);

  useEffect(() => {
    const fetchDms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dm/list`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setDms(prevDms => {
          if (JSON.stringify(prevDms) !== JSON.stringify(data.dms)) {
            return data.dms;
          }
          return prevDms;
        });
      } catch (error) {
        console.error("Error fetching DMs:", error);
      }
    };

    fetchDms();
  }, [dms, activeDm, trigger]);

  const handleSetActiveDm = (id) => {
    setActiveDm(id);
  };

  return (
    <main className="flex flex-col min-h-screen dark">
      {showDmCreate && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <DmCreate onClose={() => setShowDmCreate(false)} onCreateDm={(dmId) => setActiveDm(dmId)} />
        </div>
      )}

      <NavBar />
      <div className="flex flex-row flex-grow mt-20">
        <DmListSidebar activeDm={activeDm} onDmClick={handleSetActiveDm} onNewDmClick={() => setShowDmCreate(true)} dms={dms} />
        {activeDm && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ width: '100%', minHeight: "calc(100vh - 80px)", maxHeight: "calc(100vh - 80px)", padding: "0.5rem", borderRadius: 0 }}>
              <Card shadow='none' style={{ display: "flex", flexDirection: "row", padding: "1rem" }}>
                <User
                  name={friendFullName}
                  description={`@${friendHandle}`}
                  avatarProps={{
                    src: "https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg"
                  }}
                />
              </Card>
              <Divider />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxHeight: "calc(100vh - 250px)", marginTop: "10px" }}>
                <div style={{ flex: 1, overflowY: 'scroll' }}>
                  {messages.map((msg, idx) => (
                    <div style={{ textAlign: "left" }} key={idx} id={idx === messages.length - 1 ? "lastMessage" : ""}>
                      <Card style={{ borderRadius: 0, width: "99%" }}>
                        <CardHeader style={{ fontWeight: "bolder", paddingBottom: 0 }}>
                          {msg.senderHandle}:
                        </CardHeader>
                        <CardBody style={{ paddingTop: 0 }}>
                          {msg.message}
                        </CardBody>
                      </Card>
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
        )}
      </div>
    </main>
  );
}
