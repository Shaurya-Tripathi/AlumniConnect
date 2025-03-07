import { getAllUsers, GetStatus } from '@/app/api/(client-side)/firestoreAPI';
import React, { useMemo, useState } from 'react';
import PostCard from '../../PostCard/PostCard';

export default function UserPosts({currentUser}) {
  const [allstatus, setAllstatus] = useState([]);
  const [allUsers,setAllUsers] = useState([]);
  useMemo(() => {
    GetStatus(setAllstatus);
    getAllUsers(setAllUsers)
  }, []);

  return (
    <div className='flex justify-center w-full'>
      <div className="w-full md:w-7/12 mt-4 flex flex-col items-center gap-2">
        {allstatus.filter((item)=>{
          return item.userEmail === currentUser?.email
        }).slice().sort((a,b)=>new Date(b.timeStamp) - new Date(a.timeStamp)).map((posts) => (
          <PostCard key={posts.postID} posts={posts} allUsers={allUsers} />
        ))}
      </div>
    </div>
  );
}

