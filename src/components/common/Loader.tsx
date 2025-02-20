import React from 'react'
import { Space, Spin } from 'antd'
export default function Loader() {
  return (
    <div className='flex justify-center items-center h-screen flex-col gap-3'>
      <p className='font-medium font-serif text-white text-xl'>Loading..Please Wait...</p>
        <Space size='middle'>
          <Spin size='large'/>
        </Space>  
    </div>
  )
}
