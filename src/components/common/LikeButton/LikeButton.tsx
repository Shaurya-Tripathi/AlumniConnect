import React, { useMemo, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { getLikesByUser, likePost } from '@/app/api/(client-side)/firestoreAPI';

export default function LikeButton({ userId, postId }) {
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        likePost(userId, postId, liked);
    };

    useMemo(() => {
        getLikesByUser(userId, postId, setLiked, setLikesCount);
    }, [userId, postId]);

    return (
        <div className="flex flex-col gap-2 p-2 cursor-pointer group" onClick={handleLike}>
            {/* Likes Count Text */}
            <p className={`text-[14px] font-extralight ${liked ? 'text-blue-500' : 'text-white'}`}>
                {likesCount} {likesCount === 1 ? 'person' : 'people'} liked this post
            </p>

            {/* Like Button */}
            <div className="flex items-center gap-2">
                <ThumbsUp className={`h-5 w-5 transition-colors duration-200 ${liked ? 'text-blue-500' : 'text-white'} group-hover:text-blue-500`} />
                <span className={`text-[14px] transition-colors duration-200 ${liked ? 'text-blue-500' : 'text-white'} group-hover:text-blue-500`}>
                    {liked ? 'Liked' : 'Like'}
                </span>
            </div>
        </div>
    );
}
