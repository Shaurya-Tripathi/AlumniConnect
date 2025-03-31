'use client'
import { useState, useEffect } from "react";
import { PostStatus } from "@/app/api/(server-side)/firestoreAPI";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PostCard from "../PostCard/PostCard";
import { getCurrentTimeStamp } from "@/hooks/useMoment";
import { getUniqueID } from "@/lib/helpers";
import { ImageIcon, VideoIcon, X, AlertCircle } from "lucide-react";
import { GetStatus } from "@/app/api/(client-side)/firestoreAPI";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmojiPicker } from "@/components/emoji-picker";
import { uploadImage as uploadImageAPI } from '@/app/api/(server-side)/firestoreAPI';
import { Progress } from '@/components/ui/progress';

// File size limits in bytes
const IMAGE_SIZE_LIMIT = 3 * 1024 * 1024; // 3MB
const VIDEO_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

function Feed({currentUser, allUsers}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(""); 
  const [allStatus, setAllStatus] = useState([]);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileError, setFileError] = useState(null);
  
  const validateFileSize = (file, type) => {
    if (type === 'image' && file.size > IMAGE_SIZE_LIMIT) {
      return `Image size exceeds the limit of 3MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`;
    }
    
    if (type === 'video' && file.size > VIDEO_SIZE_LIMIT) {
      return `Video size exceeds the limit of 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`;
    }
    
    return null;
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Determine file type
    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    
    // Validate file size
    const error = validateFileSize(file, fileType);
    if (error) {
      setFileError(error);
      return;
    }
    
    // Clear previous error if exists
    setFileError(null);
    
    // Set media file and type
    setMediaFile(file);
    setMediaType(fileType);
    
    // Create preview
    const preview = URL.createObjectURL(file);
    setMediaPreview(preview);
  };
  
  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setFileError(null);
  };
  
  const sendStatus = async (currentUser) => {
    if (fileError) return;
    
    setUploading(true);
    let userEmail = localStorage.getItem('userEmail');
    let mediaUrl = null;
    
    // If there's a media file, upload it first
    if (mediaFile) {
      try {
        // Using the same upload function as profile picture but for post media
        mediaUrl = await uploadImageAPI(mediaFile, currentUser?.userId, setUploadProgress, null, true);
      } catch (error) {
        console.error("Media upload failed:", error);
        setFileError("Failed to upload media. Please try again.");
        setUploading(false);
        return;
      }
    }
    
    let object = {
      status: status,
      timeStamp: getCurrentTimeStamp('LLL'),
      userEmail: userEmail,
      userName: currentUser?.name,
      postID: getUniqueID(),
      userID: currentUser?.userId,
      mediaUrl: mediaUrl,
      mediaType: mediaType
    }
    
    await PostStatus(object);
    setUploading(false);
    clearMedia();
    setStatus("");
    setOpen(false);
  };
  
  const handleEmojiChange = (emoji) => {
    setStatus(prev => prev + emoji);
  };

  useEffect(() => {
    GetStatus(setAllStatus);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-4">
      {/* Post creation box */}
      <div className="bg-zinc-950 w-7/12 h-auto min-h-[15vh] gap-5 flex justify-center items-center rounded-md border border-gray-600 p-4">
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
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Input
                  className="border-none outline-none text-wrap text-lg font-sans w-full pr-10"
                  placeholder="What are you thinking about?"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <EmojiPicker onChange={handleEmojiChange} />
                </div>
              </div>
              
              {/* File error message */}
              {fileError && (
                <Alert variant="destructive" className="bg-red-900 border-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}
              
              {/* Media preview */}
              {mediaPreview && (
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full bg-black/50 hover:bg-black/70"
                      onClick={clearMedia}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  
                  {mediaType === 'image' ? (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full h-64 object-contain rounded-md" 
                    />
                  ) : (
                    <video 
                      src={mediaPreview} 
                      controls 
                      className="w-full h-64 object-contain rounded-md"
                    />
                  )}
                </div>
              )}
              
              {/* Media upload controls */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer p-2 rounded-full hover:bg-zinc-800 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
                
                <label className="cursor-pointer p-2 rounded-full hover:bg-zinc-800 flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Video</span>
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              {/* Upload progress */}
              {uploading && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Uploading media...</p>
                  <Progress value={uploadProgress} className="h-2 bg-zinc-700 [&>div]:bg-blue-500" />
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button 
                className="text-black bg-white hover:bg-red-500 hover:text-white" 
                onClick={() => {
                  setOpen(false);
                  clearMedia();
                }}
              >
                Cancel
              </Button>
              <Button
                className="hover:text-white hover:bg-blue-500"
                disabled={(!status.trim() && !mediaFile) || uploading || fileError}
                onClick={() => sendStatus(currentUser)}
              >
                {uploading ? "Posting..." : "Post"}
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