"use client"
import React from "react";

import { Button, Card, CardBody, Divider, Input, Link } from "@nextui-org/react";
import { NavBar } from "@/components/Navbar";

export default function Page() {
  return (
    <main style={{ color: "black" }} className="flex min-h-screen items-center justify-center dark">
      <NavBar />
      <Card style={{ width: "35%", padding: "2rem", border: "0.1rem solid rgba(255, 255, 255, 0.4)", marginTop: "80px" }} className="flex items-center flex-col">
        <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
          <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" />
          <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" />
          <Button color="primary" variant="solid" style={{ width: "40%" }}>
            Sign In
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
            <Link href="/register">Sign In</Link>
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
