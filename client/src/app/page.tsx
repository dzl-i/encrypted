"use client"
import React from "react";

import { NavBar } from "@/components/NavbarPublic";
import { Features } from "@/components/Features";
import { Button, Card, CardBody, Divider, Input, Link } from "@nextui-org/react";

export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "500px", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody>
          <h1 style={{ textAlign: "center" }}>
            Welcome to Encrypted!
          </h1>
        </CardBody>
        <Divider />
        <CardBody>
          <h2 style={{ textAlign: "center" }}>
            Encrypted is an End-to-End encryption chat application!
          </h2>
        </CardBody>
      </Card>
    </main>
  );
}
