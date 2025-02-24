import { GetStatus } from '@/app/api/(client-side)/firestoreAPI';
import React, { useMemo, useState } from 'react';
import PostCard from '../../PostCard/PostCard';

export default function UserPosts({currentUser}) {
  const [allstatus, setAllstatus] = useState([]);

  useMemo(() => {
    GetStatus(setAllstatus);
  }, []);

  return (
    <div className='flex justify-center w-full'>
      <div className="w-full md:w-7/12 mt-4 flex flex-col items-center gap-2">
        {allstatus.filter((item)=>{
          return item.userEmail === currentUser.email
        }).slice().sort((a,b)=>new Date(b.timeStamp) - new Date(a.timeStamp)).map((posts) => (
          <PostCard key={posts.postID} posts={posts} />
        ))}
      </div>
    </div>
  );
}

