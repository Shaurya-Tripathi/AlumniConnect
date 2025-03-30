import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getConnections } from '@/app/api/(client-side)/firestoreAPI';

function ResultantUser({ user, currentUser, getCurrentUser, handleDisconnect,searchInp }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (currentUser?.userId && user?.id) {
      getConnections(currentUser.userId, user.id, setIsConnected);
    }
  }, [currentUser, user]);

 

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 object-contain">
          <AvatarImage src={user?.pp} alt={user?.name} />
          <AvatarFallback className="text-gray-300 bg-gray-700">U</AvatarFallback>
        </Avatar>

        <div className='flex gap-8'>
          <p className="text-lg font-semibold text-gray-200">{user?.name}</p>
          <p className="text-lg text-gray-400">{user?.branchInfo}</p>
        </div>
      </div>

      {isConnected ? (
        <Button 
          className="bg-red-700 text-gray-300 hover:bg-red-600"
          onClick={() => handleDisconnect(user?.id)}
        >
          Disconnect
        </Button>
      ) : (
        <Button 
          className="bg-blue-600 text-gray-300 hover:bg-blue-500"
          onClick={() => getCurrentUser(user?.id)}
        >
          Connect
        </Button>
      )}
    </div>
  );
}

export default ResultantUser;
