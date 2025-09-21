import React, { useState } from "react";
import { LoginButton } from "./LoginButton";
import "../background.css";

export default function LandingPage() {
  const [headingText] = useState("Welcome to Promptly");

  return (
    <div className="page-container min-h-screen flex flex-col justify-center bg-modern-gradient px-6 py-12 gap-5">
      {/* Centered heading */}
<div className="text-center">
  <h1
    style={{ 
      marginBottom: "6rem",
      fontSize: "clamp(5rem, 12vw, 8rem)" // responsive font size: min 80px, scales with viewport, max 240px
    }}
    className="font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-gray-900 drop-shadow-lg"
  >
    {headingText}
  </h1>
</div>

      {/* Button with 20px gap from heading */}
      <div className="w-full flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
}