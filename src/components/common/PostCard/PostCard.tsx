import React from 'react';
import { useRouter } from 'next/navigation';

export default function PostCard({ posts }) {
  const router = useRouter();
  return (
    <div className='bg-zinc-950 w-full h-auto flex flex-col text-wrap rounded-md border border-gray-600 p-4 gap-2'>
      <div className='flex justify-between items-center text-gray-300 text-sm'>
        <p className=' underline font-semibold cursor-pointer hover:text-blue-500' onClick={()=> router.push(`/profile?userID=${posts.userID}`)}>{posts.userName}</p>
        <p className='text-gray-500'>{posts.timeStamp}</p>
      </div>
      <p className='text-gray-300 text-left font-sans text-base font-normal'>{posts.status}</p>
    </div>
  );
}

