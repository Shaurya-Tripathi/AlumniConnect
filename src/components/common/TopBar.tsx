// components/common/TopBar.tsx
import React from 'react';
import Link from 'next/link';
import { 
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  User
} from 'lucide-react';
import ProfileDrop from './ProfileDrop';

const TopBar = () => {
  return (
    <>
      <div className="flex justify-evenly pt-2 pb-2 bg-black text-white">
        <div className="text-2xl flex justify-start w-1/2 ml-2">
          <Link href="/" className="flex">
            <span className="text-blue-500">Alumni</span>Connect
          </Link>
        </div>
        <div className="text-2xl w-1/2 flex justify-end gap-6 mr-4">
          <Link href="/home" className="flex flex-col items-center hover:text-blue-400">
            <Home className="w-6 h-6" />
            <span className="text-sm mt-1">Home</span>
          </Link>
          <Link href="/network" className="flex flex-col items-center hover:text-blue-400">
            <Users className="w-6 h-6" />
            <span className="text-sm mt-1">Network</span>
          </Link>
          <Link href="/jobs" className="flex flex-col items-center hover:text-blue-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-sm mt-1">Jobs</span>
          </Link>
          <Link href="/messages" className="flex flex-col items-center hover:text-blue-400">
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm mt-1">Messages</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center hover:text-blue-400">
            <Bell className="w-6 h-6" />
            <span className="text-sm mt-1">Notifications</span>
          </Link>
          <ProfileDrop/>
        </div>
      </div>
      <hr className="border-gray-700"/>
    </>
  );
};

export default TopBar;