'use client'
import { Toast } from "@/components/ui/toast";
import { firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, snapshotEqual, where } from "firebase/firestore";
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

export const getAllUsers = (setAllUsers)=>{
    const dbRef = collection(firestore,"users");
    onSnapshot(dbRef,(response)=>{
        setAllUsers(
            response.docs.map((doc)=>{
                return {...doc.data(), id: doc.id}; 
        }))
    });
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

export const getSingleStatus = (setAllStatus, id) => {
    const dbRef = collection(firestore, "posts");
    const singlePostQuery = query(dbRef, where("userID", "==", id));
    onSnapshot(singlePostQuery, (response) => {
        setAllStatus(response.docs.map((docs) => {
            return { ...docs.data(), id: docs.id }
        }));
    });
};

export const getSingleUserById = (setCurrentUser, email) => {
    const dbRef = collection(firestore, 'users');
    const singleUserQuery = query(dbRef, where("email", "==", email));
    onSnapshot(singleUserQuery, (response) => {
        setCurrentUser(
            response.docs.map((docs) => {
                return { ...docs.data(), id: docs.id };
            })[0]
        );
    });
};

export const likePost = (userId, postId, liked) => {
    try {
        let dbRef = collection(firestore, 'likes');
        let docTolike = doc(dbRef, `${userId}_${postId}`)
        if(liked){
            deleteDoc(docTolike);
        }else{
            setDoc(docTolike, { userId, postId });
        }
    } catch (err) {
        console.log("Can't like :",err);
    }
}

export const AddConnection = (userId, targetId) => {
    try {
        let dbRef = collection(firestore, 'connections');
        let connectionToAdd = doc(dbRef, `${userId}_${targetId}`)
            setDoc(connectionToAdd, { userId, targetId })
            console.log("Added succesfully")
    } catch (err) {
        console.log("Can't add user :",err);
    }
}

export const getLikesByUser = (userId,postId,setLiked,setLikesCount)=>{
    try {
        let dbRef =  collection(firestore,'likes');
        let likeQuerry = query(dbRef, where("postId","==",postId));
        onSnapshot(likeQuerry,(snapshot)=>{
            let likes = snapshot.docs.map((docs)=>docs.data());
            let likesCount = likes.length;

            const isLiked =  likes.some((like)=>like.userId === userId);
            setLikesCount(likesCount);
            setLiked(isLiked);
        })
    } catch (error) {
        console.log("Cannot get like details: ",error);
    }
}

export const postComment = (postId, comment, timestamp,name)=>{
    let dbRef = collection(firestore,"comments");

    try{addDoc(dbRef,{
        postId,
        comment,
        timestamp,
        name

    })}catch(err){
        console.error("Comment Post failed: ",err);
    }
}

export const getComments = (postId,setComments)=>{
    let dbRef = collection(firestore,"comments");
    try{
        let singlePostQuery = query(dbRef,where('postId',"==",postId));
        onSnapshot(singlePostQuery,(response)=>{
            const comments = response.docs.map((doc)=>{
                return{
                    id: doc.id,
                    ...doc.data()
                }
            })
            setComments(comments);
        })
    }catch(error){
        console.error("Can't fetch comments: ",error);
    }
}
 
export const getConnections = (userID, targetID, setIsConnected)=>{
    try {
        let dbRef =  collection(firestore,'connections');
        let connectionQuerry = query(dbRef, where("targetId","==",targetID));
        onSnapshot(connectionQuerry,(snapshot)=>{
            let connections = snapshot.docs.map((docs)=>docs.data());
            let connectionCount = connections.length;

            const isConnected =  connections.some((connection)=>connection.userId === userID);
            setIsConnected(isConnected);
        })
    } catch (error) {
        console.log("Cannot get connection details: ",error);
    }
}

export const removeConnection = async (userID, targetID) => {
    try {
        // Find the connection document
        let dbRef = collection(firestore, 'connections');
        let connectionQuery = query(
            dbRef, 
            where("userId", "==", userID),
            where("targetId", "==", targetID)
        );
        
        const snapshot = await getDocs(connectionQuery);
        
        // Delete the connection document
        if (!snapshot.empty) {
            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
        }
    } catch (error) {
        console.log("Error removing connection:", error);
    }
}
