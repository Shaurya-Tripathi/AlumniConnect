import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Experience from './ProfilePieces/Experience'
import Education from './ProfilePieces/Education'
import UserPosts from './ProfilePieces/UserPosts'
import Accomplishments from './ProfilePieces/Accomplishments'
import Skill from './ProfilePieces/Skill'
import Projects from './ProfilePieces/Projects'
import QuickLinks from './ProfilePieces/QuickLinks'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"





export default function ProfileCard({ currentUser}) {

  const[editHero,setEditHero] = useState(false);

  return (
    <div className="flex flex-row justify-start border bg-zinc-900 h-screen w-screen ml-5 overflow-hidden">
      <div className='text-white  h-auto w-2/5 flex flex-col gap-y-20'>
        {/* User Main profile */}
        <div className='border border-gray-500 h-3/5 m-2 mt-6 flex flex-col justify-center items-center gap-3 rounded-md'>
          <Avatar className='w-1/3 h-1/3'>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className='font-bold text-2xl'>{currentUser.name}</p>
          <p className='font-extralight -mt-2'>{currentUser.email}</p>
          <p className='font-medium'>Headlines</p>

        </div>
        {/* Quick Links */}
        <div className=' h-1/3  m-2 mb-6 border border-gray-600 rounded-lg relative'>
          <div className='flex flex-col justify-center gap-2'>
            <div className='text-center'>Quick Links</div>
            <QuickLinks currentUser={currentUser}/></div>
        </div>
      </div>
      {/* Right side of the Screen */}
      <div className='text-white border border-gray-600 h-auto w-full  flex justify-center items-baseline m-6'>
        <div className='mt-4'>
          <Tabs defaultValue="experience" className="w-[800px]">
            <TabsList className='bg-slate-800 p-2 text-gray'>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="experience">Experience</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="education">Education</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="posts">Posts</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="skills">Skills</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-500' value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="experience"><Experience /></TabsContent>
            <TabsContent value="education"><Education /></TabsContent>
            <TabsContent value="posts"><UserPosts /></TabsContent>
            <TabsContent value="accomplishments"><Accomplishments /></TabsContent>
            <TabsContent value="skills"><Skill /></TabsContent>
            <TabsContent value="projects"><Projects /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>

  )
}
