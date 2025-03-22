import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase"; // Firestore client
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        // ✅ Read and parse request body
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
        }

        const { userId } = JSON.parse(bodyText); // Extract `userId` instead of `currentUser`
        if (!userId) {
            return NextResponse.json({ error: "Invalid request data: userId is missing" }, { status: 400 });
        }

        // ✅ Query Firestore: Find all connections where userId === userId
        const dbRef = collection(firestore, "connections");
        const connectionQuery = query(dbRef, where("userId", "==", userId));
        
        // ✅ Fetch the connections
        const snapshot = await getDocs(connectionQuery);
        const connectedIds = snapshot.docs.map((doc) => doc.data().targetId); // Extract targetId values

        console.log("Connected IDs:", connectedIds); // Debugging log

        return NextResponse.json({ connectedIds, message: "Connections fetched successfully" });
    } catch (error) {
        console.error("Error fetching connections:", error);

        // Ensure TypeScript recognizes 'error' as an instance of Error
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}
