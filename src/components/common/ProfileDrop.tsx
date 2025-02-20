'use client'
import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { logoutApi } from '@/lib/auth';

const ProfileDrop = () => {
    const [open, setOpen] = useState(false);
    
    const handleProfileClick = () => {
        setOpen(false);
    };
    
    const handleLogout = () => {
        logoutApi()
        setOpen(false);
    };
    
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex flex-col items-center hover:text-blue-400">
                <User className="w-6 h-6" />
                <span className="text-sm mt-1">Profile</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg rounded-md">
                <DropdownMenuItem>
                    <Link 
                        href="/profile" 
                        className="flex items-center gap-2 w-full"
                        onClick={handleProfileClick}
                    >
                        <User className="w-4 h-4" /> Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <button 
                        className="flex items-center gap-2 w-full text-red-500" 
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileDrop;
