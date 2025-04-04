import { firestore, storage } from "@/lib/firebase";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export const PostStatus = async (object) => {
    try {
        const dbRef = collection(firestore, "posts");
        // Make sure we include all media-related fields
        const postData = {
            ...object,
            mediaUrl: object.mediaUrl || null,
            mediaType: object.mediaType || null,
            likes: [] // Initialize likes array
        };
        const result = await addDoc(dbRef, postData);
        return { success: true, id: result.id };
    } catch (error) {
        console.error("Error posting status:", error);
        return { success: false, error };
    }
};

export const updateStatus = async (postID, newContent, mediaUrl = null, mediaType = null) => {
    try {
        let postToUpdate = doc(firestore, "posts", postID);
        // Include media fields in update if they exist
        const updateData = { 
            status: newContent,
            // Only include media fields if they exist
            ...(mediaUrl && { mediaUrl }),
            ...(mediaType && { mediaType })
        };
        await updateDoc(postToUpdate, updateData);
        console.log("Post updated successfully");
    } catch (err) {
        console.log("Can't update the post: ", err);
    }
};

export const deleteStatus = async (postID) =>{
    try{
        const postRef = doc(firestore,"posts",postID);
        await deleteDoc(postRef)
        console.log("Post deleted Successfully");
    }catch(err){
        console.log("can't delete the post: ",err);
    }
} 

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

export const updateUserBasicInfo = async(object, userID)=>{
    try{
        let userRef = collection(firestore,'users');
        let userToEdit = doc(userRef, userID);
        await updateDoc(userToEdit,object);
    }catch(error){
        console.error("Cannot update basic details: "+error);
    }
}

export const updateUserProfile = async (object, userID) => {
    try { 
        let userToEdit = doc(firestore, "users", userID); 
        await updateDoc(userToEdit, object);
        console.log('Success');
    } catch (error) {
        console.error("Cannot update profile: ", error);
    }
};

export const uploadImage = async (file, userID, setProgress, setCurrentImage, isPostMedia = false) => {
    // Different path for posts vs profile pictures
    const storagePath = isPostMedia 
      ? `postMedia/${userID}-${Date.now()}-${file.name}`
      : `profilePictures/${userID}-${Date.now()}-${file.name}`;
      
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (setProgress) setProgress(progress);
            },
            (error) => {
                console.error("Upload Error: ", error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        console.log("File available at:", downloadURL);
                        
                        if (!isPostMedia && setProgress && setCurrentImage) {
                            // For profile picture uploads
                            setProgress(0);
                            setCurrentImage('');
                            updateUserProfile({ pp: downloadURL }, userID)
                                .then(() => console.log("Profile updated successfully"));
                        }
                        
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        console.error("Error getting download URL:", error);
                        reject(error);
                    });
            }
        );
    });
};