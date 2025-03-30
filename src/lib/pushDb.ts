import { db } from "./db";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, snapshotEqual, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export const pushIntoDb = async (currentUser,allUsers) => {
    const profile = await db.user.findUnique({
        where: {
            id : currentUser?.id
        }
    });

    const connectedIds: string[] = [];

    for (const user of allUsers) {
        
        let dbRef =  collection(firestore,'connections');
        let connectionQuerry = query(dbRef, where("targetId","==",user.id));
        onSnapshot(connectionQuerry,(snapshot)=>{
            let connections = snapshot.docs.map((docs)=>docs.data());
            let connectionCount = connections.length;

            const isConnected =  connections.some((connection)=>connection.userId === currentUser?.id);
            if(isConnected){
                connectedIds.push(user.id);
            }
        })
    }

    console.log(connectedIds)

    if(!profile){
        await db.user.create({
            data: {
                usrId : currentUser?.id,
                name: `${currentUser?.name} `,
                email: `${localStorage.getItem('userEmail')}`,
                image: currentUser?.pp,
                connectionIds: connectedIds,
            }
        });
    }else{
        await db.user.update({
            where: {
                id: currentUser?.id
            },
            data: {
                connectionIds: connectedIds
            }
        });
    }
}


// SAFE