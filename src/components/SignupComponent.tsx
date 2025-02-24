'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { signupApi } from '@/lib/auth';
import { ToastContainer, toast } from 'react-toastify/unstyled';
import { useRouter } from 'next/navigation';
import { PostUserData } from '@/app/api/(server-side)/firestoreAPI';
import { getUniqueID } from '@/lib/helpers';



export default function SignupComponent() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    name:'',
    email: '',
    password: ''
  });

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signupApi(credentials.email, credentials.password)
      PostUserData({name:credentials.name,email:credentials.email , userID:getUniqueID()});
      //Store email in localStorage
      if (typeof window !== "undefined" && res?.email) {
        localStorage.setItem("userEmail", res.email);
      } else if (typeof window !== "undefined" && res?.reloadUserInfo?.email) {
        localStorage.setItem("userEmail", res.reloadUserInfo.email);
      }

      toast.success('Registration successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      setTimeout(() => {
        router.replace('/home');
      }, 4000);


    } catch (error) {
      toast.error("Registration failed. Please check your credentials", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
      console.log(`Login failed ${error}`)
    }
  }


  return (
    <div className='bg-black h-screen w-full flex flex-col justify-center items-center'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <div className='mb-8'>
        <h1 className='text-4xl font-bold font-serif text-white'>Register</h1>
      </div>
      <form className='bg-gray-800 p-8 rounded-lg shadow-xl w-96 flex flex-col space-y-6 border border-gray-700'
        onSubmit={signup}>
        <div className='flex flex-col'>
          <label className="text-lg font-medium mb-2 text-gray-300" htmlFor='name'>Name</label>

          <input onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
            placeholder='Enter your Name'
            type="text" name="name"
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex flex-col'>
          <label className="text-lg font-medium mb-2 text-gray-300" htmlFor='email'>Email</label>

          <input onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            placeholder='Enter your email'
            type="email" name="email"
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <div className='flex flex-col'>
          <label className="text-lg font-medium mb-2 text-gray-300" htmlFor='password'>Password</label>
          <input
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder='Enter your password'
            type="password"
            name="password"
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500' />
        </div>
        <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500'>Register</button>
      </form>
      <p className='mt-4 text-gray-400'>
        Already have an account?<span className='ml-2'>
          <Link href='/login' className='text-blue-500 hover:text-blue-400 transition duration-300 ease-in-out'>Login</Link>
        </span>
      </p>
    </div>
  )
}
