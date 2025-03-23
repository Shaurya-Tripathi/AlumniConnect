import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase"; // Firestore client
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/db"; // Import Prisma client

export async function POST(req: Request) {
    try {
        //Read and parse request body
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
        }

        const { userId } = JSON.parse(bodyText); // Extract `userId` instead of `currentUser`
        if (!userId) {
            return NextResponse.json({ error: "Invalid request data: userId is missing" }, { status: 400 });
        }

        // Query Firestore: Find all connections where userId === userId
        const dbRef = collection(firestore, "connections");
        const connectionQuery = query(dbRef, where("userId", "==", userId));
        
        // Fetch the connections
        const snapshot = await getDocs(connectionQuery);
        const connectedIds = snapshot.docs.map((doc) => doc.data().targetId); // Extract targetId values

        console.log("Connected IDs:", connectedIds); // Debugging log

        // add here
        try {
            // Check if user exists in MongoDB using findFirst since usrId might not be unique
            const profile = await db.user.findFirst({
                where: {
                    usrId: userId
                }
            });

            if (!profile) {
                // User doesn't exist, create new user
                await db.user.create({
                    data: {
                        usrId: userId,
                        name: "New User", // Use a default name or get from request
                        email: `user-${userId}-${Date.now()}@placeholder.com`, // Generate unique email
                        connectionIds: connectedIds,
                        conversationIds: [],
                        seenMessageIds: []
                    }
                });
                console.log("New user created with connectionIds");
            } else {
                // User exists, update connectionIds
                await db.user.update({
                    where: {
                        id: profile.id // Use the MongoDB _id
                    },
                    data: {
                        connectionIds: connectedIds
                    }
                });
                console.log("Existing user updated with connectionIds");
            }
        } catch (dbError) {
            console.log("Database operation failed:", dbError instanceof Error ? dbError.message : "Unknown error");
            // Continue execution to still return the connectedIds
        }

        return NextResponse.json({ connectedIds, message: "Connections fetched successfully" });
    } catch (error) {
        console.error("Error fetching connections:", error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json({ error: "Internal Server Error", details: errorMessage }, { status: 500 });
    }
}