import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from "@/app/assets/Images/Logo.png";
import Image from "next/image";
import "../../app/globals.css";
import "@/app/assets/styles/login.css";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function isValid() {
      const res = await fetch("/api/session", { credentials: "same-origin" });
      const data = await res.json();
      console.log(data);
      if (data.code === 0) {
        window.location.href = "/";
      }
    }
    isValid();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin", // For same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        window.location.href = "/";
      } else {
        console.error("Login failed:", data.err);
        alert(`Login failed: ${data.err}`);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }
  };

  return (
    <>
    <Link href="/" passHref>
      <Image
        src={Logo}
        alt="Logo"
        className="login-logo w-[60%] mt-20 md:mt-0 md:w-full"
      />
    </Link>
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-heading">Login</h1>
          <div className="login-input-box">
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="login-icon" />
          </div>
          <div className="login-input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="login-icon" />
          </div>
          <button type="submit" className="login-submit-btn">
            Login
          </button>
          <div className="login-link">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </form>
      </div>

      <a href="#" className="login-back-button">
        <FaArrowLeft className="back-icon" />
        Back
      </a>
    </>
  );
}
