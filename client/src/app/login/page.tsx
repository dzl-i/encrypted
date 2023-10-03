"use client"
import React, { useState } from "react";

import { Button, Card, CardBody, Divider, Input, Link, Spinner } from "@nextui-org/react";
import { NavBar } from "@/components/Navbar";
import { useRouter } from "next/navigation";

import "dotenv/config";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);

      // Construct an object with the input values
      const userData = {
        email,
        password
      };

      // Send the userData to your API using fetch
      const response = await fetch(`${process.env.API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // const data = await response.json();

        // TODO: setAuth

        // Redirect to the "/message" route upon successful sign-up
        router.push("/message");
      } else {
        // Handle error response from the API
        console.error("API Error:", response.statusText);
      }
    } catch (error) {
      // Handle any other errors
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ color: "black" }} className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "35%", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" onChange={handleEmailChange} />
          <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" onChange={handlePasswordChange} />
          <Button color="primary" variant="solid" style={{ width: "40%" }} onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? <Spinner size="md" color="default" /> : "Log In"}
          </Button>
        </CardBody>
        <Divider />
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <p className="text-xs" style={{ textAlign: "center", color: "gray" }}>Or log in with:</p>
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
            No account?{" "}
            <Link href="/register">Sign Up</Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
