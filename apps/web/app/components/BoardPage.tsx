import React from "react";
import Image from "next/image";
import { LoginButton } from "./LoginButton";

const columns = [
  { name: "To do", color: "bg-pink-100", dot: "bg-pink-400" },
  { name: "Doing", color: "bg-yellow-100", dot: "bg-yellow-400" },
  { name: "Under review", color: "bg-blue-100", dot: "bg-blue-400" },
  { name: "Done", color: "bg-green-100", dot: "bg-green-400" },
];

const cards = [
  [
    { title: "Make a new Post", desc: "Write your post, tell about our new launch...", date: "10/28/21", users: ["/avatar1.png", "/avatar2.png"] },
    { title: "Make a website prototype", desc: "Design a landing page for the value of each section...", date: "1/28/21", users: ["/avatar1.png", "/avatar2.png"] },
  ],
  [
    { title: "Check design materials", desc: "Review design assets and style guide...", date: "11/12/21", users: ["/avatar2.png", "/avatar3.png"] },
  ],
  [
    { title: "Discuss Year budget", desc: "Determine goals and objectives...", date: "6/13/21", users: ["/avatar3.png"] },
    { title: "Content plan", desc: "Create a content plan for the period...", date: "7/12/21", users: ["/avatar1.png", "/avatar3.png"] },
  ],
  [
    { title: "Weekly planning meeting", desc: "Discuss next week’s plan, tasks...", date: "8/30/21", users: ["/avatar2.png"] },
    { title: "Discuss a new concept", desc: "Creation of a unified visual image...", date: "9/15/21", users: ["/avatar1.png"] },
    { title: "Discuss Month budget", desc: "Review monthly budget and targets...", date: "7/18/21", users: ["/avatar3.png"] },
  ],
];

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold text-blue-600 mb-8">Boards</h2>
        <nav className="flex flex-col gap-4">
          <a className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600" href="#">
            <span className="w-2 h-2 rounded-full bg-pink-400"></span> To Do
          </a>
          <a className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-yellow-50 font-medium text-yellow-600" href="#">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Doing
          </a>
          <a className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium text-blue-600" href="#">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Under Review
          </a>
          <a className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-50 font-medium text-green-600" href="#">
            <span className="w-2 h-2 rounded-full bg-green-400"></span> Done
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-white/80 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
          <div>
            <LoginButton />
          </div>
        </div>
        {/* Board Columns */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-4 gap-6">
            {columns.map((col, idx) => (
              <section key={col.name} className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${col.dot}`}></span>
                  <h2 className="text-lg font-semibold text-gray-800">{col.name}</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {cards[idx]?.map((card, cidx) => (
                    <article key={cidx} className="rounded-lg shadow-md bg-white p-4 hover:shadow-lg transition-shadow border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                      <p className="text-gray-500 text-sm mb-3">{card.desc}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{card.date}</span>
                        <div className="flex -space-x-2">
                          {card.users.map((u, i) => (
                            <Image key={i} src={u} alt="User" className="w-6 h-6 rounded-full border" width={24} height={24} />
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
