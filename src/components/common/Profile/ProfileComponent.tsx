import React from 'react'
import ProfileCard from './ProfileCard'

export default function ProfileComponent({currentUser}) {
  
  return (
    <div>
    <ProfileCard currentUser = {currentUser}/>
    </div>
  )
}
