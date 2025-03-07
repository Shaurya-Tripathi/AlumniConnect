import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LikeButton from '../LikeButton/LikeButton';
import { getAllUsers, GetCurrentUser } from '@/app/api/(client-side)/firestoreAPI';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function PostCard({ posts, allUsers }) {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    GetCurrentUser(setCurrentUser);
  }, [])

 

// console.log(allUsers.filter((item) => item.id === posts.userID).map((item) => item.pp)[0]);


  const router = useRouter();

  return (
    <div className="bg-zinc-950 w-full h-auto flex flex-col text-wrap rounded-md border border-gray-600 p-4 gap-2">
      
      {/* Header Section */}
      <div className="flex justify-between items-center text-gray-300 text-sm">
        
        {/* Left: Avatar & Name */}
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className="object-contain"
              src={
                (allUsers?.filter((item) => item.id === posts.userID).map((item) => item.pp)[0]) || ""

              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
  
          <p
            className="underline font-semibold cursor-pointer hover:text-blue-500"
            onClick={() =>
              router.push(
                `/profile/${posts?.userID}?email=${encodeURIComponent(posts?.userEmail)}`
              )
            }
          >
            {posts.userName}
          </p>
        </div>
  
        {/* Right: Timestamp */}
        <p className="text-gray-500">{posts.timeStamp}</p>
      </div>
  
      {/* Post Content */}
      <p className="text-gray-300 text-left font-sans text-base font-normal mt-4 mb-4">
        {posts.status}
      </p>
  
      {/* Like Button */}
      <LikeButton userId={currentUser?.userId} postId={posts.id} currentUser={currentUser} />
    </div>
  );
  

