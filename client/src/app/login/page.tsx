"use client"
import React, { useState } from "react";

import { Button, Card, CardBody, Divider, Input, Link, Spinner } from "@nextui-org/react";
import { NavBar } from "@/components/NavbarPublic";
import { useRouter } from "next/navigation";

import "dotenv/config";
import { ErrorMessage } from "@/components/ErrorMessage";
import { getHash } from "@/util/crypto";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogIn();
    }
  };

  const handleLogIn = async () => {
    try {
      setIsLoading(true);

      // Get the hash of the password before sending it to the backend
      const hashedPassword = getHash(password);

      // Construct an object with the input values
      const userData = {
        email,
        hashedPassword
      };

      // Send the userData to your API using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Redirect to the "/message" route upon successful sign-up
        router.push("/message");

        const responseData = await response.json();
        sessionStorage.setItem("userHandle", responseData.userHandle);
        sessionStorage.setItem("userFullName", responseData.userFullName);
        sessionStorage.setItem("publicKey", responseData.userPublicKey);
      } else {
        // Handle error response from the API
        const errorData = await response.json();
        setErrorMessage(errorData.error);  // Set the error message received from backend
      }
    } catch (error) {
      // Handle any other errors
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ color: "black" }} className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "500px", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" onChange={handleEmailChange} onKeyDown={handleKeyDown} />
          <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" onChange={handlePasswordChange} onKeyDown={handleKeyDown} />
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
          <Button color="primary" variant="solid" style={{ width: "70%" }} onClick={handleLogIn} disabled={isLoading}>
            {isLoading ? <Spinner size="md" color="default" /> : "Log In"}
          </Button>
        </CardBody>
        <Divider />
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <p className="text-xs" style={{ textAlign: "center", color: "gray" }}>Or log in with:</p>
          <Button color="primary" variant="bordered" style={{ width: "70%", alignContent: "center" }}>
            Continue with Google
          </Button>
          <Button color="primary" variant="bordered" style={{ width: "70%", alignContent: "center" }}>
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
