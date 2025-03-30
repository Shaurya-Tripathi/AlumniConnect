'use client'
import { useState, useEffect } from "react";
import { PostStatus} from "@/app/api/(server-side)/firestoreAPI";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostCard from "../PostCard/PostCard";
import { getCurrentTimeStamp } from "@/hooks/useMoment";
import { getUniqueID } from "@/lib/helpers";
import { Key } from "lucide-react";
import { GetStatus } from "@/app/api/(client-side)/firestoreAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function Feed({currentUser,allUsers}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(""); 
  const [allStatus, setAllStatus] = useState([]);
  // console.log(currentUser); 

  const sendStatus = (currentUser) => {
    let userEmail = localStorage.getItem('userEmail');
    let object = {
      status:status,
      timeStamp: getCurrentTimeStamp('LLL'),
      userEmail:userEmail,
      userName: currentUser?.name,
      postID:getUniqueID(),
      userID:currentUser?.userId
    }
    PostStatus(object);
  };
  console.log(getCurrentTimeStamp('LLL'));

  useEffect(() => {
    GetStatus(setAllStatus);
  }, []);


  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-4">
  {/* Post creation box */}
  <div className="bg-zinc-950 w-7/12 h-[15vh] gap-5 flex justify-center items-center rounded-md border border-gray-600 p-4">
  <Avatar className='h-[70px] w-[70px] object-contain'>
                    <AvatarImage src={currentUser?.pp} />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-blue-100 text-black hover:bg-blue-500 w-4/5" onClick={() => setOpen(true)}>
          What's on your mind?
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <Input
          className="border-none outline-none text-wrap text-lg font-sans w-full"
          placeholder="What are you thinking about?"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <DialogFooter className="flex justify-end gap-2">
          <Button className="text-black bg-white hover:bg-red-500 hover:text-white" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="hover:text-white hover:bg-blue-500"
            disabled={!status.trim()}
            onClick={() => {
              sendStatus(currentUser);
              setOpen(false);
              setStatus("");
            }}
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>

  {/* Posts section */}
  <div className="w-7/12 mt-4 flex flex-col items-center gap-2">
    {allStatus.slice().sort((a,b)=> new Date(b.timeStamp) - new Date(a.timeStamp)).map((posts) => (
      <PostCard key={posts.postID} posts={posts} allUsers={allUsers}/>
    ))}
  </div>
</div>

  );
}

export default Feed;

