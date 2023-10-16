import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Spinner } from "@nextui-org/react";
import { EncryptedLogo } from "./logo/EncryptedLogo";
import { LogoutConfirmation } from "./LogoutConfirmation";

export const NavBar = () => {
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const router = useRouter();

  const handleLogoutClick = async () => {
    try {
      setIsLoadingLogout(true);

      const response = await fetch(`https://api.encrypted.denzeliskandar.com/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("API Error: ", response.statusText);
      }
    } catch (error) {
      console.error("Token refresh failed: ", error);
    } finally {
      setIsLoadingLogout(false);
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
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button color="primary" variant="solid" onClick={() => setShowLogoutConfirmation(true)}>
            Log Out
          </Button>
        </NavbarItem>
      </NavbarContent>

      {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogoutClick}
          onCancel={() => setShowLogoutConfirmation(false)}
          isLoadingLogout={isLoadingLogout}
        />
      )}
    </Navbar>
  );
};
