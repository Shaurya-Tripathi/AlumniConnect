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

export const getSingleStatus = (setAllStatus, id)=>{
    const dbRef = collection(firestore, "posts");
    const singlePostQuery = query(dbRef, where("userID" ,"==", id));
    onSnapshot(singlePostQuery, (response)=>{
        setAllStatus(response.docs.map((docs)=>{
            return{...docs.data(), id: docs.id}
        }));
    });
};

export const getSingleUserById = (setCurrentUser, email)=>{
    const dbRef = collection(firestore,'users');
    const singleUserQuery = query(dbRef, where("email","==", email));
    onSnapshot(singleUserQuery, (response)=>{
        setCurrentUser(
            response.docs.map((docs)=>{
                return{...docs.data(), id: docs.id};
            })[0]
        );
    });
};