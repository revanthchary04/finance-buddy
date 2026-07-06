"use client";

import { useEffect, useState } from "react";

export function DashboardGreeting({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState<string>("Dashboard");
  const [subGreeting, setSubGreeting] = useState<string>("Real-time analytics, cash flow trends, and financial activity.");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if we've already generated a greeting this session
    const storedGreeting = sessionStorage.getItem("financeBuddyGreeting");
    const storedSubGreeting = sessionStorage.getItem("financeBuddySubGreeting");

    if (storedGreeting && storedSubGreeting) {
      // If we refresh the page, keep the same greeting for the active session
      setGreeting(storedGreeting);
      setSubGreeting(storedSubGreeting);
      return;
    }

    const todayDate = new Date().toDateString();
    const lastGreetingDate = localStorage.getItem("financeBuddyLastGreetingDate");
    const currentHour = new Date().getHours();
    
    let timeGreeting = "Good morning";
    if (currentHour >= 12 && currentHour < 17) timeGreeting = "Good afternoon";
    else if (currentHour >= 17) timeGreeting = "Good evening";

    const randomGreetings = [
      "Ready to crush your financial goals?",
      "Let's make today a great day for your finances!",
      "Here is your financial overview.",
      "Hope you're having a wonderful day!",
    ];
    
    const randomWelcomeBacks = [
      "Great to see you again so soon!",
      "Checking in on those numbers?",
      "Back for more financial insights?",
    ];

    const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    let newGreeting = "";
    let newSubGreeting = "";

    if (lastGreetingDate !== todayDate) {
      // First time today
      newGreeting = `${timeGreeting}, ${userName}!`;
      newSubGreeting = pickRandom(randomGreetings);
      localStorage.setItem("financeBuddyLastGreetingDate", todayDate);
    } else {
      // Second+ time today
      newGreeting = `Welcome back, ${userName}!`;
      newSubGreeting = pickRandom(randomWelcomeBacks);
    }

    // Persist this exact greeting in the active tab so refreshes don't change it
    sessionStorage.setItem("financeBuddyGreeting", newGreeting);
    sessionStorage.setItem("financeBuddySubGreeting", newSubGreeting);

    setGreeting(newGreeting);
    setSubGreeting(newSubGreeting);
  }, [userName]);

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {greeting}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {subGreeting}
      </p>
    </div>
  );
}
