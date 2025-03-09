import { AddConnection, getAllUsers } from '@/app/api/(client-side)/firestoreAPI'
import React, { useEffect, useState } from 'react'
import ConnectedUsers from './ConnectedUsers';


function ConnectionComponent({currentUser}) {
    const [users,setUsers] = useState([]);
    const getCurrentUser = (id)=>{
        console.log(id);
        AddConnection(currentUser?.userId,id)
    }

    useEffect(()=>{
        getAllUsers(setUsers);
    },[])

    return (
        <div className='text-white grid grid-cols-[auto_auto] cursor-pointer text-center justify-center items-center '>
            {users.map((user) =>
                user.id === currentUser.userId ? (
                    <React.Fragment key={user.id}></React.Fragment>
                ) : (
                    <ConnectedUsers key={user.id} user={user} getCurrentUser={getCurrentUser} />
                )
            )}
        </div>
    );
}

export default ConnectionComponent