"use client"
import React, { useState } from "react";

import { Button, Card, CardBody, Divider, Input, Link } from "@nextui-org/react";
import { NavBar } from "@/components/Navbar";

export default function Page() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      // Construct an object with the input values
      const userData = {
        name,
        email,
        password,
        handle: username,
      };

      // Send the userData to your API using fetch
      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the response from the API
        console.log("API Response:", data);
      } else {
        // Handle error response from the API
        console.error("API Error:", response.statusText);
      }
    } catch (error) {
      // Handle any other errors
      console.error("Error:", error);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "35%", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <Input isRequired size="md" type="ame" label="Full Name" placeholder="Enter your full name" onChange={handleNameChange} />
          <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" onChange={handleEmailChange} />
          <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" onChange={handlePasswordChange} />
          <Input isRequired size="md" type="" label="Username" placeholder="Enter your username" onChange={handleUsernameChange} />
          <Button color="primary" variant="solid" style={{ width: "40%" }} onClick={handleSignIn}>
            Sign In
          </Button>
        </CardBody>
        <Divider />
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <p className="text-xs" style={{ textAlign: "center", color: "gray" }}>Or sign in with:</p>
          <Button color="primary" variant="bordered" style={{ width: "40%", alignContent: "center" }}>
            Continue with Google
          </Button>
          <Button color="primary" variant="bordered" style={{ width: "40%", alignContent: "center" }}>
            Continue with GitHub
          </Button>
          <p className="text-xs" style={{ textAlign: "center", color: "gray" }}>Disclaimer: Does not work yet :(</p>
        </CardBody>
        <Divider />
        <CardBody>
          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login">Log In</Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
