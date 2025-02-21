import { firestore } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export const PostStatus = async (object) => {
    try {
        const dbRef = collection(firestore, "posts");
        const result = await addDoc(dbRef, object);
        return { success: true, id: result.id };
    } catch (error) {
        console.error("Error posting status:", error);
        return { success: false, error };
    }
};

export const PostUserData = async (object) => {
    try {
        const dbRef = collection(firestore, 'users');
        const result = await addDoc(dbRef, object);
        return { success: true, id: result.id };
    } catch (error) {
        console.error("Error sending user data:", error);
        return { success: false, error };
    }
};