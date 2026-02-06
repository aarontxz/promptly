import React from "react";
import { LoginButton } from "./LoginButton";
import "../background.css";

export default function LandingPage() {
  return (
    <div className="page-container min-h-screen w-full flex flex-col justify-center bg-modern-gradient px-6 gap-5 m-0 p-0 overflow-hidden">
      {/* Centered heading */}
      <div className="text-center">
        <h1
          style={{ 
            marginBottom: "2rem",
            fontSize: "clamp(5rem, 12vw, 8rem)",
            background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
          className="font-extrabold text-center drop-shadow-lg"
        >
          Welcome to Promptly
        </h1>
        
        <h4>
          The easiest and most seamless way to learn a new language. Create flashcards using AI and have the prompts sent to you through out the day on your Telegram to be answered.
        </h4>
      </div>

      <div className="w-full flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
}