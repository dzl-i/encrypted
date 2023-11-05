"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Card, CardBody, Divider, Input, Link, Spinner } from "@nextui-org/react";
import { NavBar } from "@/components/NavbarPublic";
import { ErrorMessage } from "@/components/ErrorMessage";

import { generateKeyPair, exportCryptoKey } from "@/util/crypto";

import "dotenv/config";
import { openDB } from "idb";


// Generate a RSA key pair (public key and private key)
const generateAndStoreKeys = async () => {
  try {
    // Generate key pair
    const { privateKey, publicKey } = await generateKeyPair();

    // Export the public key to a format suitable for your backend (e.g., PEM or Base64)
    const exportedPublicKey = await exportCryptoKey(publicKey);

    sessionStorage.setItem("publicKey", exportedPublicKey);

    // Store the private key securely in IndexedDB
    const db = await openDB('keyDB', 1, {
      upgrade(db) {
        db.createObjectStore('keys');
      },
    });

    const tx = db.transaction('keys', 'readwrite');
    await tx.store.put(privateKey, 'privateKey');
    await tx.done;

    return exportedPublicKey;
  } catch (error) {
    console.error('Error generating or storing keys', error);
  }
};


export default function Page() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

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

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      // Generate and store keys, and get the public key
      const exportedPublicKey = await generateAndStoreKeys();

      // Construct an object with the input values
      const userData = {
        name,
        email,
        password,
        handle: username,
        publicKey: exportedPublicKey
      };

      // Send the userData to using fetch
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "500px", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <Input isRequired size="md" type="name" label="Full Name" placeholder="Enter your full name" onChange={handleNameChange} onKeyDown={handleKeyDown} />
          <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" onChange={handleEmailChange} onKeyDown={handleKeyDown} />
          <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" onChange={handlePasswordChange} onKeyDown={handleKeyDown} />
          <Input isRequired size="md" type="" label="Username" placeholder="Enter your username" onChange={handleUsernameChange} onKeyDown={handleKeyDown} />
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
          <Button color="primary" variant="solid" style={{ width: "70%" }} onClick={handleSignUp} disabled={isLoading}>
            {isLoading ? <Spinner size="md" color="default" /> : "Sign Up"}
          </Button>
        </CardBody>
        <Divider />
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <p className="text-xs" style={{ textAlign: "center", color: "gray" }}>Or sign in with:</p>
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
            Already have an account?{" "}
            <Link href="/login">Log In</Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
