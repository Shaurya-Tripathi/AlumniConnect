import { firestore } from "@/lib/firebase";
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";

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

export const updateUserWithLinks = async (object, userID) => {
    try {
        let userRef = collection(firestore, 'users');
        let userToEdit = doc(userRef, userID);

        // Update the document by adding new data to "Links" array
        await updateDoc(userToEdit, {
            Links: arrayUnion(object) // Ensures the new object is added instead of replacing
        });

        console.log("Link added to Firestore successfully");
    } catch (error) {
        console.error("Error adding link:", error);
    }
};

export const removeUserLink = async (linkID, userID) => {
    try {
        let userRef = collection(firestore, 'users');
        let userToEdit = doc(userRef, userID);

        // Get the existing document data
        const userSnap = await getDoc(userToEdit);
        if (!userSnap.exists()) {
            console.error("User document not found");
            return;
        }

        // Filter out the link to remove
        const existingLinks = userSnap.data().Links || [];
        const updatedLinks = existingLinks.filter(link => link.linkID !== linkID);

        // Update Firestore with the new array (Firestore doesn't support arrayRemove for objects)
        await updateDoc(userToEdit, { Links: updatedLinks });

        console.log("Link removed from Firestore successfully");
    } catch (error) {
        console.error("Error removing link:", error);
    }
};