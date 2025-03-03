import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Experience from './ProfilePieces/Experience'
import Education from './ProfilePieces/Education'
import UserPosts from './ProfilePieces/UserPosts'
import Accomplishments from './ProfilePieces/Accomplishments'
import Skill from './ProfilePieces/Skill'
import Projects from './ProfilePieces/Projects'
import QuickLinks from './ProfilePieces/QuickLinks'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PenBoxIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { DialogTitle } from '@radix-ui/react-dialog'
import { Input } from '@/components/ui/input'
import { updateUserBasicInfo, uploadImage as uploadImageAPI } from '@/app/api/(server-side)/firestoreAPI'

export default function ProfileCard({ currentUser }) {
  const [editHero, setEditHero] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    city: '',
    country: '',
    headline: ''
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [isDp, setIsDp] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleCity = (e) => {
    setBasicInfo({ ...basicInfo, city: e.target.value });
  }

  const handleCountry = (e) => {
    setBasicInfo({ ...basicInfo, country: e.target.value });
  }

  const handleHeadline = (e) => {
    setBasicInfo({ ...basicInfo, headline: e.target.value });
  }

  const handleSubmit = async () => {
    const updatedInfo = {};
    if (basicInfo.city.trim()) updatedInfo.city = basicInfo.city;
    if (basicInfo.country.trim()) updatedInfo.country = basicInfo.country;
    if (basicInfo.headline.trim()) updatedInfo.headline = basicInfo.headline;

    if (Object.keys(updatedInfo).length > 0) {
      await updateUserBasicInfo(updatedInfo, currentUser?.userId);
    }
    setEditHero(false);
  }

  const getImage = (e) => {
    setCurrentImage(e.target.files[0]);
  }

  const handleUpload = async () => {
    if (!currentImage) {
      console.error("No image selected.");
      return;
    }
    try {
      await uploadImageAPI(currentImage, currentUser?.userId);
      setOpenImageDialog(false);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.pp != null) {
      setIsDp(true);
    }
  }, [currentUser?.pp])

  return (
    <div className="flex flex-row justify-start border bg-black h-screen w-screen ml-3 overflow-hidden">
      <div className='text-white h-auto w-2/5 flex flex-col gap-y-20'>
        <div className='border border-gray-500 h-3/5 m-2 mt-6 flex flex-col justify-center items-center gap-3 rounded-md relative'>
          <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
            <DialogTrigger asChild>
              <Avatar className='w-1/3 h-1/3 cursor-pointer '>
                <AvatarImage src={isDp ? currentUser?.pp : ""} className='object-contain'/>
                <AvatarFallback className='text-black'>User</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-white p-6 rounded-lg">
              <DialogHeader>
                <DialogTitle>Update Profile Picture</DialogTitle>
              </DialogHeader>
              {currentImage && (
                <img src={URL.createObjectURL(currentImage)} alt="Preview" className="w-full h-48  rounded-md mb-4 object-contain" />
              )}
              <Input type="file" accept='image/*' onChange={getImage} className='mb-4' />
              <DialogFooter className="flex justify-end gap-4 mt-4">
                <Button className='bg-white text-black hover:bg-red-600 hover:outline-none hover:text-white' onClick={() => setOpenImageDialog(false)}>Cancel</Button>
                <Button className='hover:bg-blue-500' disabled={currentImage? false:true} onClick={handleUpload}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <p className='font-bold text-2xl'>{currentUser?.name}</p>
          <p className='font-extralight -mt-2'>
            {currentUser?.city && currentUser?.country
              ? `${currentUser.city}, ${currentUser.country}`
              : "Location not provided"}
          </p>
          <p className="text-lg/6 font-semibold text-gray-300 text-center px-4">
            {currentUser?.headline ? currentUser.headline : "The user hasn't added a headline"}
          </p>
        </div>
        <div className='h-1/3 m-2 mb-6 border border-gray-600 rounded-lg relative'>
          <div className='flex flex-col justify-center gap-2'>
            <div className='text-center'>Quick Links</div>
            <QuickLinks currentUser={currentUser} />
          </div>
        </div>
      </div>
      <div className='text-white border border-gray-600 h-auto w-full flex justify-center items-baseline mt-6 mb-6 ml-3'>
        <div className='mt-4'>
          <Tabs defaultValue="experience" className="w-[800px]">
            <TabsList className='bg-slate-800 p-2 text-gray flex justify-center'>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="accomplishments">Accomplishments</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="experience"><Experience /></TabsContent>
            <TabsContent value="education"><Education /></TabsContent>
            <TabsContent value="posts"><UserPosts currentUser={currentUser} /></TabsContent>
            <TabsContent value="accomplishments"><Accomplishments /></TabsContent>
            <TabsContent value="skills"><Skill /></TabsContent>
            <TabsContent value="projects"><Projects /></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
