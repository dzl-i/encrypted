import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@nextui-org/react"
import { useState } from "react";

type DmCreateProps = {
  onClose: () => void;
  onCreateDm: (dmId) => void;
};

export const DmCreate: React.FC<DmCreateProps> = ({ onClose, onCreateDm }) => {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateDm();
    }
  };

  const handleCreateDm = async () => {
    try {
      const payload = {
        userHandles: [username]
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dm/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response to get the JSON data
        onCreateDm(responseData.dmId);
      } else {
        // Handle error response from the API
        const errorData = await response.json();
        console.error(errorData.error);  // Set the error message received from backend
      }
    } catch (error) {
      // Handle any other errors
      console.error("An unexpected error occurred. Please try again later.");
    } finally {
      onClose()
    }
  }

  return (
    <Card style={{ width: "400px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#050804" }}>
      <CardHeader style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h3 style={{ fontWeight: "bolder" }}>Create New Direct Message</h3>
      </CardHeader>
      <CardBody style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Input isRequired size="md" type="name" label="Username" placeholder="Search..." onChange={handleUsernameChange} onKeyDown={handleKeyDown} />
      </CardBody>
      <CardFooter style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Button color="primary" onClick={handleCreateDm} style={{ marginBottom: "1.5rem" }}>Create Direct Message</Button>
        <Button color="danger" onClick={onClose}>Cancel</Button>
      </CardFooter>
    </Card>
  );
}
