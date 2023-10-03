"use client"
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center dark">
      <Card>
        <CardBody>
          <h1 style={{ color: "white", margin: "2rem" }}>This is where messages will be listed</h1>
          <Button as={Link} color="danger" href="/" style={{ margin: "2rem" }}>
            Back to Home
          </Button>
        </CardBody>
      </Card>
    </main>
  );
}