"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GetCurrentUser, getAllUsers } from "@/app/api/(client-side)/firestoreAPI";

function Page() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch current user and all users
  useEffect(() => {
    GetCurrentUser(setCurrentUser);
    getAllUsers(setAllUsers);
  }, []);

  // Call the API to push data into DB
  useEffect(() => {
    if (currentUser?.userId && allUsers.length > 0) {  // Ensure userId exists
      fetch("/api/pushDb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.userId }), // Send only userId
      })
        .then((res) => res.json())
        .then((data) => console.log("API Response:", data))
        .catch((err) => console.error("API Error:", err));
    }
  }, [currentUser, allUsers]);
  

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="message-content">Select someone</div>
    </div>
  );
}

export default Page;
