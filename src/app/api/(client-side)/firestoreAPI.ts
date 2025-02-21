'use client'
import { firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export const GetStatus = (setAllStatus) => {
    const dbRef = collection(firestore, "posts");
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
        setAllStatus(snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })));
    }, (error) => {
        console.error("Error fetching status:", error);
        toast.error("Failed to fetch statuses.");
    });

    return unsubscribe;
};

export const GetCurrentUser = (setCurrentUser) => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
        if (!user) {
            setCurrentUser(null);
            return;
        }

        const userQuery = query(
            collection(firestore, "users"), 
            where("email", "==", user.email)
        );

        const unsubscribeFirestore = onSnapshot(userQuery, (response) => {
            const userData = response.docs.map((doc) => ({
                ...doc.data(),
                userId: doc.id,
            }))[0];

            setCurrentUser(userData || null);
        });

        return unsubscribeFirestore;
    });

    return () => {
        unsubscribeAuth();
    };
};