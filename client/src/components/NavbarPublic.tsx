import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Spinner } from "@nextui-org/react";
import { ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale } from "./logo/Logo";
import { EncryptedLogo } from "./logo/EncryptedLogo";

import "dotenv/config";

export const NavBar = () => {
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    lock: <Lock className="text-success" fill="currentColor" size={30} />,
    activity: <Activity className="text-secondary" fill="currentColor" size={30} />,
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    server: <Server className="text-success" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };

  const router = useRouter();

  const handleLoginOrSignupClick = async (route: string) => {
    try {
      if (route === "/login") {
        setIsLoadingLogin(true);
      } else if (route === "/register") {
        setIsLoadingSignup(true);
      }

      // Make a request to the /auth/refresh route to refresh the token
      const response = await fetch(`https://api.encrypted.denzeliskandar.com/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to the "/message" route upon successful sign-up
        router.push("/message");
      } else {
        // Handle error response from the API
        console.error("API Error: ", response.statusText);

        router.push(route);
      }
    } catch (error) {
      // Handle token refresh failure (e.g., display an error message)
      console.error("Token refresh failed: ", error);
      router.push(route);
    } finally {
      setIsLoadingLogin(false);
      setIsLoadingSignup(false);
    }
  };

  return (
    <Navbar className="dark navbar">
      <NavbarBrand>
        <Link href="/">
          <EncryptedLogo />
          <p className="font-bold text-inherit" style={{ color: "white" }}>ENCRYPTED</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center" style={{ alignItems: "center" }}>
        <Dropdown className="dark" style={{ color: "white" }}>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
                style={{ verticalAlign: "middle" }}
              >
                Features
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px] dark"
            itemClasses={{ base: "gap-4" }}
          >
            <DropdownItem
              key="autoscaling"
              description="ACME scales apps to meet user demand, automagically, based on load."
              startContent={icons.scale}
            >
              Autoscaling
            </DropdownItem>
            <DropdownItem
              key="usage_metrics"
              description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
              startContent={icons.activity}
            >
              Usage Metrics
            </DropdownItem>
            <DropdownItem
              key="production_ready"
              description="ACME runs on ACME, join us and others serving requests at web scale."
              startContent={icons.flash}
            >
              Production Ready
            </DropdownItem>
            <DropdownItem
              key="99_uptime"
              description="Applications stay on the grid with high availability and high uptime guarantees."
              startContent={icons.server}
            >
              +99% Uptime
            </DropdownItem>
            <DropdownItem
              key="supreme_support"
              description="Overcome any challenge with a supporting team ready to respond."
              startContent={icons.user}
            >
              +Supreme Support
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link color="foreground" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button color="primary" variant="light" onClick={async () => handleLoginOrSignupClick("/login")} disabled={isLoadingLogin}>
              {isLoadingLogin ? <Spinner size="md" color="default" /> : "Log In"}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button color="primary" variant="solid" onClick={async () => handleLoginOrSignupClick("/register")} disabled={isLoadingSignup}>
              {isLoadingSignup ? <Spinner size="md" color="default" /> : "Sign Up"}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
}
