import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LikeButton from '../LikeButton/LikeButton';
import { getConnections, GetCurrentUser } from '@/app/api/(client-side)/firestoreAPI';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ellipsis } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStatus, deleteStatus } from '@/app/api/(server-side)/firestoreAPI';

export default function PostCard({ posts, allUsers }) {
  const [currentUser, setCurrentUser] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState(posts.status);
  const [isConnected, setIsConnected] = useState(false);

  const router = useRouter();

  useEffect(() => {
    GetCurrentUser(setCurrentUser);
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      getConnections(currentUser?.userId, posts?.userID, setIsConnected);
    }
  }, [currentUser?.userId, posts?.userID]);

  // ✅ Ensure posts are only displayed if the user is connected OR it's their own post
  if (!isConnected && posts.userID !== currentUser?.userId) return null;

  const handleUpdate = () => setEditDialogOpen(true);
  const handleDelete = () => setDeleteDialogOpen(true);

  const confirmUpdate = async () => {
    if (newPostContent.length > 1) {
      await updateStatus(posts.id, newPostContent);
      setEditDialogOpen(false);
    }
  };

  const confirmDelete = () => {
    deleteStatus(posts.id);
    setDeleteDialogOpen(false);
  };

  return (
    <div className="bg-zinc-950 w-full h-auto flex flex-col text-wrap rounded-md border border-gray-600 p-4 gap-2">
      {/* Header Section */}
      <div className="flex justify-between items-center text-gray-300 text-sm">
        {/* Left: Avatar & Name */}
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className="object-contain"
              src={allUsers?.find((item) => item.id === posts.userID)?.pp || ""}
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
        
        {/* Right: Ellipsis & Timestamp */}
        <div className="flex flex-col items-end gap-1">
          {currentUser?.userId === posts?.userID && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black">
                <DropdownMenuItem onClick={handleUpdate} className="text-blue-500">Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <p className="text-gray-500 text-xs">{posts.timeStamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-300 text-left font-sans text-base font-normal mt-4 mb-4">
        {posts.status}
      </p>

      {/* Like Button */}
      <LikeButton userId={currentUser?.userId} postId={posts.id} currentUser={currentUser} />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='bg-zinc-800'>
          <DialogHeader>
            <DialogTitle className='text-white'>Edit Post</DialogTitle>
          </DialogHeader>
          <Input className='text-white' value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
          <DialogFooter>
            <Button className='bg-white text-black hover:bg-red-500 hover:text-white' 
              disabled={newPostContent.length < 1} 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmUpdate} className="bg-black hover:bg-blue-500 text-white">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className='bg-black'>
          <DialogHeader>
            <DialogTitle className='text-white'>Confirm Delete?</DialogTitle>
          </DialogHeader>
          <p className='text-white'>Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter>
            <Button className='bg-white text-black hover:bg-blue-500 hover:text-white' 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-800 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
