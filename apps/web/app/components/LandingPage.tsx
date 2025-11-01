import React from "react";
import { LoginButton } from "./LoginButton";
import "../background.css";

export default function LandingPage() {
  return (
    <div className="page-container h-screen flex flex-col justify-center bg-modern-gradient px-6 gap-5">
      {/* Centered heading */}
      <div className="text-center">
        <h1
          style={{ 
            marginBottom: "6rem",
            fontSize: "clamp(5rem, 12vw, 8rem)"
          }}
          className="font-extrabold text-center text-gray-900 drop-shadow-lg"
        >
          Welcome to Promptly
        </h1>
      </div>

      {/* Button with 20px gap from heading */}
      <div className="w-full flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
}