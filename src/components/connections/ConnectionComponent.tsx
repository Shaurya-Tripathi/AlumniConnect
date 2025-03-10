import { AddConnection, getAllUsers, removeConnection } from '@/app/api/(client-side)/firestoreAPI';
import React, { useEffect, useState } from 'react';
import ConnectedUsers from './ConnectedUsers';

function ConnectionComponent({currentUser}) {
    const [users, setUsers] = useState([]);
    
    const getCurrentUser = (id) => {
        console.log(id);
        AddConnection(currentUser?.userId, id);
    }
    
    const handleDisconnect = (id) => {
        console.log("Disconnecting from:", id);
        removeConnection(currentUser?.userId, id);
    }

    useEffect(() => {
        getAllUsers(setUsers);
    }, []);

    return (
        <div className='text-white grid grid-cols-[auto_auto] text-center justify-center items-center pt-10 gap-10'>
            {users.map((user) =>
                user.id === currentUser.userId ? (
                    <React.Fragment key={user.id}></React.Fragment>
                ) : (
                    <ConnectedUsers 
                        key={user.id} 
                        user={user} 
                        currentUser={currentUser}
                        getCurrentUser={getCurrentUser}
                        handleDisconnect={handleDisconnect}
                    />
                )
            )}
        </div>
    );
}

export default ConnectionComponent;