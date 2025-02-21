'use client'
import { useState, useMemo } from "react";
import { PostStatus} from "@/app/api/(server-side)/firestoreAPI";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostCard from "../PostCard/PostCard";
import { getCurrentTimeStamp } from "@/hooks/useMoment";
import { getUniqueID } from "@/lib/helpers";
import { Key } from "lucide-react";
import { GetStatus } from "@/app/api/(client-side)/firestoreAPI";

function Feed({currentUser}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(""); 
  const [allStatus, setAllStatus] = useState([]);

  const sendStatus = () => {
    let userEmail = localStorage.getItem('userEmail');
    let object = {
      status:status,
      timeStamp: getCurrentTimeStamp('LLL'),
      userEmail:userEmail,
      userName: currentUser.name,
      postID:getUniqueID()
    }
    PostStatus(object);
  };
  console.log(getCurrentTimeStamp('LLL'));

  useMemo(() => {
    GetStatus(setAllStatus);
  }, []);

  //console.log(allStatus);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-4">
  {/* Post creation box */}
  <div className="bg-zinc-950 w-7/12 h-[15vh] flex justify-center items-center rounded-md border border-gray-600 p-4">
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
          <Button className="text-black bg-white hover:bg-zinc-900 hover:text-white" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="hover:text-black hover:bg-white"
            disabled={!status.trim()}
            onClick={() => {
              sendStatus();
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
    {allStatus.map((posts) => (
      <PostCard posts={posts}/>
    ))}
  </div>
</div>

  );
}

export default Feed;

