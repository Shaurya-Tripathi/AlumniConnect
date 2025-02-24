"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
} from "lucide-react";
import ProfileDrop from "./ProfileDrop";

const TopBar = () => {
  const pathname = usePathname(); // Get current route

  return (
    <>
      <div className="flex justify-evenly pt-2 pb-2 bg-black text-white">
        <div className="text-2xl flex justify-start w-1/2 ml-2">
          <Link href="/home" className="flex">
            <span className="text-blue-500">Alumni</span>Connect
          </Link>
        </div>
        <div className="text-2xl w-1/2 flex justify-end gap-6 mr-4">
          <NavItem href="/home" icon={<Home className="w-6 h-6" />} label="Home" active={pathname === "/home"} />
          <NavItem href="/network" icon={<Users className="w-6 h-6" />} label="Network" active={pathname === "/network"} />
          <NavItem href="/jobs" icon={<Briefcase className="w-6 h-6" />} label="Jobs" active={pathname === "/jobs"} />
          <NavItem href="/messages" icon={<MessageSquare className="w-6 h-6" />} label="Messages" active={pathname === "/messages"} />
          <NavItem href="/notifications" icon={<Bell className="w-6 h-6" />} label="Notifications" active={pathname === "/notifications"} />
          <ProfileDrop />
        </div>
      </div>
      <hr className="border-gray-700" />
    </>
  );
};

const NavItem = ({ href, icon, label, active }) => (
  <Link
    href={href}
    className={`flex flex-col items-center hover:text-blue-400 ${
      active ? "text-blue-500" : "text-white"
    }`}
  >
    {icon}
    <span className="text-sm mt-1">{label}</span>
  </Link>
);

export default TopBar;
