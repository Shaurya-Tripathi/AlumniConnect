'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { loginApi } from '@/lib/auth'
import { ToastContainer, toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css'


export default function LoginComponent() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await loginApi(credentials.email, credentials.password)
      
      //Store email in localStorage
      if (typeof window !== "undefined" && res?.email) {
        localStorage.setItem("userEmail", res.email);
      } else if (typeof window !== "undefined" && res?.reloadUserInfo?.email) {
        localStorage.setItem("userEmail", res.reloadUserInfo.email);
      }

      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
        setTimeout(() => {
          router.replace('/home');
        }, 4000);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      console.log('Login failed', error)
    }
  }


  return (
    <div className='bg-black text-white h-screen w-full flex flex-col justify-center items-center overflow-hidden'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className='mb-8'>
        <h1 className='text-4xl font-bold font-serif text-white'>Login</h1>
      </div>

      <form 
        className='bg-gray-800 p-8 rounded-lg shadow-xl w-96 flex flex-col space-y-6 border border-gray-700'
        onSubmit={login}
      >
        <div className='flex flex-col'>
          <label 
            className="text-lg font-medium mb-2 text-gray-300" 
            htmlFor="email"
          >
            Email
          </label>
          <input
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setCredentials({ 
              ...credentials, 
              email: e.target.value 
            })}
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>


        <div className='flex flex-col'>
          <label 
            className="text-lg font-medium mb-2 text-gray-300" 
            htmlFor="password"
          >
            Password
          </label>
          <input
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setCredentials({ 
              ...credentials, 
              password: e.target.value 
            })}
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>


        <button 
          type="submit" 
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
        Login
        </button>

      </form>


      <p className='mt-4 text-gray-400'>
        New to AlumniConnect? 
        <span className='ml-2'>
          <Link 
            href="/enrollment" 
            className='text-blue-500 hover:text-blue-400 transition duration-300 ease-in-out'
          >
            Join Now
          </Link>
        </span>
      </p>


    </div>
  )
}