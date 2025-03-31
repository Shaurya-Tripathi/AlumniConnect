import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getConnections } from '@/app/api/(client-side)/firestoreAPI';

function ConnectedUsers({ user, currentUser, getCurrentUser, handleDisconnect }) {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (currentUser?.userId && user?.id) {
      getConnections(currentUser.userId, user.id, setIsConnected);
    }
  }, [currentUser, user]);

  return (
    <Card 
      className="w-[300px] p-4 bg-gray-900 border border-gray-700 rounded-xl hover:shadow-lg transition-all">
      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.pp} alt={user?.name} />
          <AvatarFallback className="text-gray-300 bg-gray-700">U</AvatarFallback>
        </Avatar>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-200">{user?.name}</p>
          <p className="text-lg font-light text-gray-400">{user?.branchInfo}</p>
          <p className="text-sm text-gray-400">{user?.headline}</p>
        </div>

        {isConnected ? (
          <Button 
            className="w-full bg-red-700 text-gray-300 hover:bg-red-600 cursor-pointer"
            onClick={() => handleDisconnect(user?.id)}
          >
            Disconnect
          </Button>
        ) : (
          <Button 
            className="w-full bg-gray-800 text-gray-300 hover:bg-blue-500 cursor-pointer"
            onClick={() => getCurrentUser(user?.id)}
          >
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ConnectedUsers;