import React from 'react'

function ConnectedUsers({user,getCurrentUser}) {
  return (
    <div className='border border-slate-400 w-[300px] h-[150px] p-[10px] m-[10px]' onClick={()=>{getCurrentUser(user?.id)}}>
        <p className='text-white'>{user?.name}</p>
        <p className='text-white'>{user?.headline}</p>
    </div>
  )
}

export default ConnectedUsers