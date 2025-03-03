'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyEnrollmentComponent() {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState('');

  const verifyEnrollment = async (e) => {
    e.preventDefault();
    
    if (!enrollment.trim()) {
      toast.error('Please enter your enrollment number.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    // Simulated verification (Replace with actual API call)
    const isValid = enrollment.length === 10; // Example condition
    
    if (isValid) {
      toast.success('Enrollment verified!', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push('/signup');
      }, 2500);
    } else {
      toast.error('Invalid enrollment number.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className='bg-black text-white h-screen w-full flex flex-col justify-center items-center overflow-hidden'>
      <ToastContainer />
      
      <div className='mb-8'>
        <h1 className='text-4xl font-bold font-serif text-white'>Before we begin, verify your enrollment</h1>
      </div>

      <form 
        className='bg-gray-800 p-8 rounded-lg shadow-xl w-96 flex flex-col space-y-6 border border-gray-700'
        onSubmit={verifyEnrollment}
      >
        <div className='flex flex-col'>
          <label 
            className="text-lg font-medium mb-2 text-gray-300" 
            htmlFor="enrollment"
          >
            Enrollment Number
          </label>
          <input
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setEnrollment(e.target.value)}
            type="text"
            name="enrollment"
            placeholder="Enter your enrollment number"
            required
          />
        </div>

        <button 
          type="submit" 
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Verify
        </button>
      </form>
    </div>
  );
}
