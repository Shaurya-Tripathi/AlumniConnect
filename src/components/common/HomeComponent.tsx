import React from 'react'
import Feed from '@/components/common/postUpdate/Feed'

const HomeComponent = ({currentUser}) => {
    return (
        <main className='bg-black flex justify-center items-center min-h-screen'>
           <Feed currentUser={currentUser}/>
        </main>
    )
}

export default HomeComponent