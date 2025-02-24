import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { getUniqueID } from '@/lib/helpers';
import { updateUserWithLinks, removeUserLink } from '@/app/api/(server-side)/firestoreAPI';
import { X } from 'lucide-react';

export default function QuickLinks({ currentUser }) {
    const [avail, setAvail] = useState(true);
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false); 

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
    };

    const handleURLChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = async () => {
        if (label.trim().length > 0 && url.trim().length > 0) {
            const object = {
                label: label.trim(),
                url: url.trim(),
                linkID: getUniqueID()
            };
            try {
                await updateUserWithLinks(object, currentUser?.userId); 
                setUrl("");
                 
            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        }
        setIsDialogOpen(false);
    };

    const handleRemoveLink = (linkID) => {
        removeUserLink(linkID, currentUser?.userId);
    };

    return (
        <>
            {avail ? (
                <div className="flex flex-col gap-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                className="absolute right-3 top-2 bg-blue-950 rounded-full p-2 w-6 h-6 flex items-center justify-center"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                +
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 text-white">
                            <DialogHeader>
                                <DialogTitle className="text-white">Enter Link Label and URL</DialogTitle>
                                <DialogDescription>
                                    <Input
                                        type="text"
                                        className="mt-2 bg-gray-900 text-white mb-2 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Label"
                                        value={label}
                                        onChange={handleLabelChange}
                                    />
                                    <Input
                                        type="text"
                                        className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter URL"
                                        value={url}
                                        onChange={handleURLChange}
                                    />
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button onClick={handleSubmit} className="bg-white text-black hover:bg-blue-500 hover:text-white">
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
    
                    {currentUser?.Links?.length > 0 ? (
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-2">
                            {currentUser.Links.map((link) => (
                                <div key={link.linkID} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {link.label}
                                    </a>
                                    <button onClick={() => handleRemoveLink(link.linkID)} className="text-red-500 hover:text-red-700">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">User hasn't added any links</p>
                    )}
                </div>
            ) : (
                <p>Nothing to display</p>
            )}
        </>
    );
}
