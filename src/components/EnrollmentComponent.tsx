'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyEnrollmentComponent() {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const verifyEnrollment = async (e) => {
    e.preventDefault();
  
    const enrollmentNumber = Number(enrollment);
    
    if (!enrollment || isNaN(enrollmentNumber)) {
      toast.error('Please enter a valid enrollment number.', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/enroll`, { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentNumber })
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Invalid response from server");
      }
      
      if (data.success) {
        // Save user details to localStorage
        localStorage.setItem('userData', JSON.stringify(data.data));

        toast.success('Enrollment verified!', {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => router.push('/signup'), 2500);
      } else {
        toast.error(data.message || 'Invalid enrollment number.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Something went wrong. Try again!', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='bg-black text-white h-screen w-full flex flex-col justify-center items-center overflow-hidden'>
      <ToastContainer />
      <div className='mb-8'>
        <h1 className='text-4xl font-bold font-serif text-white'>
          Before we begin, verify your enrollment
        </h1>
      </div>
      <form 
        className='bg-gray-800 p-8 rounded-lg shadow-xl w-96 flex flex-col space-y-6 border border-gray-700'
        onSubmit={verifyEnrollment}
      >
        <div className='flex flex-col'>
          <label className="text-lg font-medium mb-2 text-gray-300" htmlFor="enrollment">
            Enrollment Number
          </label>
          <input
            className='bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setEnrollment(e.target.value)}
            type='text'
            inputMode="numeric"
            pattern="[0-9]*"
            name="enrollment"
            placeholder="Enter your enrollment number"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}
