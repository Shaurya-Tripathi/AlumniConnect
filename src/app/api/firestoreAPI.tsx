import { firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";

export const PostStatus = async (object) => {
    try {
        const dbRef = collection(firestore, "posts");
        await addDoc(dbRef, object);
        toast.success("Status posted successfully!");
    } catch (error) {
        console.error("Error posting status:", error);
        toast.error("Failed to post status.");
    }
};

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

    return unsubscribe; // Caller should handle cleanup
};

export const PostUserData = async (object) => {
    try {
        const dbRef = collection(firestore, 'users');
        await addDoc(dbRef, object);
    } catch (error) {
        console.error("Error sending user data: " + error);
    }

};

export const GetCurrentUser = (setCurrentUser) => {
    const auth = getAuth();

    // Firebase auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
        if (!user) {
            setCurrentUser(null);
            return;
        }

        const userQuery = query(collection(firestore, "users"), where("email", "==", user.email));

        // Firestore listener
        const unsubscribeFirestore = onSnapshot(userQuery, (response) => {
            const userData = response.docs.map((doc) => ({
                ...doc.data(),
                userId: doc.id,
            }))[0]; // Get the first matched user

            setCurrentUser(userData || null);
        });

        return unsubscribeFirestore; // Cleanup function for Firestore listener
    });

    return () => {
        unsubscribeAuth(); // Cleanup function for Auth listener
    };
};

