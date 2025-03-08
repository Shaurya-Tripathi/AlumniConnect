import React, { useEffect, useState } from 'react';
import { MessageSquareMore, ThumbsUp } from 'lucide-react';
import { getComments, getLikesByUser, likePost, postComment } from '@/app/api/(client-side)/firestoreAPI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCurrentTimeStamp } from '@/hooks/useMoment';

export default function LikeButton({ userId, postId, currentUser }) {
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getLikesByUser(userId, postId, setLiked, setLikesCount);
        getComments(postId, setComments);
    }, [userId, postId]);

    const handleLike = async () => {
        await likePost(userId, postId, liked);
        setLiked(!liked);
        setLikesCount(prev => (liked ? prev - 1 : prev + 1));
    };

    const getComment = (e) => {
        setComment(e.target.value);
    }
    // console.log(comment)
    // console.log(currentUser.name);
    const addComment = () => {
        if(comment.length>0){
            postComment(postId, comment, getCurrentTimeStamp('LLL'), currentUser?.name);
        }
        
        setComment('');

    }

    return (
        <div className="flex flex-col gap-2">
            {/* Likes Count */}
            <div className="inline-block p-2 rounded-md">
                <p className={`text-[14px] font-extralight ${liked ? 'text-blue-500' : 'text-white'}`}>
                    {likesCount} {likesCount === 1 ? 'person' : 'people'} liked this post
                </p>
            </div>

            {/* Interaction Buttons */}
            <div className="grid grid-cols-[auto_auto_auto_auto]">
                {/* Like Button */}
                <div
                    className={`flex items-center gap-2 transition-colors duration-200 cursor-pointer    
                    ${liked ? 'text-blue-500' : 'text-white'} hover:text-blue-500`}
                    onClick={handleLike}
                >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-[14px]">{liked ? 'Liked' : 'Like'}</span>
                </div>

                {/* Comment Button */}
                <div
                    className={`flex items-center gap-2 cursor-pointer transition-colors duration-200 
                    ${showCommentBox ? 'text-blue-500' : 'text-white'} hover:text-blue-500`}
                    onClick={() => setShowCommentBox(!showCommentBox)}
                >
                    <MessageSquareMore className="h-5 w-5" />
                    <p className="text-[14px]">Comment</p>
                </div>
            </div>

            {/* Comment Box */}
            {showCommentBox && (
                <div className="mt-2">
                    <Input
                        onChange={getComment}
                        className="text-[14px] font-light h-10 pl-2 rounded-2xl text-white focus:border focus:border-blue-300"
                        placeholder="Add a comment"
                        name="comment"
                        value={comment}
                    />
                    <Button className="w-32 rounded-xl mt-4 bg-white text-black cursor-pointer hover:bg-blue-500 hover:text-white"
                        onClick={addComment}>
                        Add comment
                    </Button>
                    {comments.length > 0 ? comments.map((comment) => (
                        <div key={comment.id || comment.timestamp} className="text-white mt-8 bg-slate-900 p-3 rounded-2xl flex flex-row justify-between">
                            <div><p className='text-gray-200'>{comment?.name}</p>
                            <p className='text-gray-300'>{comment?.comment}</p>
                            </div>

                            <div>
                                <p className='text-gray-400 text-xs'>{comment?.timestamp}</p>
                            </div>
                            
                        </div>
                    )) : null}

                </div>
            )}
        </div>
    );
}
