'use client'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import JobCard from '@/components/jobs/JobCard'

function Page() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)
  const [jobs, setJobs] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Form state
  const [jobData, setJobData] = useState({
    companyName: '',
    package: '',
    link: '',
    branch: '',
    role: '',
    lastDate: ''
  })

  // Fetch jobs data
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load jobs on initial render
  useEffect(() => {
    fetchJobs()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          lastDate: new Date(jobData.lastDate)
        }),
      })

      if (response.ok) {
        await fetchJobs()
        setIsDialogOpen(false)
        
        // Reset form
        setJobData({
          companyName: '',
          package: '',
          link: '',
          branch: '',
          role: '',
          lastDate: ''
        })
      } else {
        console.error('Failed to add job')
      }
    } catch (error) {
      console.error("Error adding job: ", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Open delete confirmation dialog
  const confirmDeleteJob = (id) => {
    setJobToDelete(id)
    setIsDeleteDialogOpen(true)
  }
  
  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return
    
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/jobs?id=${jobToDelete}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchJobs()
        setIsDeleteDialogOpen(false)
        setJobToDelete(null)
      } else {
        console.error('Failed to delete job')
      }
    } catch (error) {
      console.error("Error deleting job: ", error)
    } finally {
      setIsDeleting(false)
    }
  }
  
  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login')
      }
    })

    return () => unsubscribe()
  }, [router])
  
  return (
    <div className="mx-auto px-0 py-8 w-full max-w-[1200px]">
      <div className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-2xl font-bold text-zinc-400">Offers</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Post New Job
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-10 border border-dashed rounded-lg mx-4">
          <p className="text-gray-500">No jobs posted yet</p>
          <Button 
            className="mt-4"
            onClick={() => setIsDialogOpen(true)}
          >
            Post Your First Job
          </Button>
        </div>
      )}

      {/* Job Listings */}
      {!isLoading && jobs.length > 0 && (
        <div className="space-y-4 px-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              companyName={job.companyName}
              package={job.package}
              link={job.link}
              branch={job.branch}
              role={job.role}
              lastDate={new Date(job.lastDate)}
              onDelete={confirmDeleteJob}
            />
          ))}
        </div>
      )}

      {/* Custom Styled Add Job Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Post a New Job</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-white">Company Name *</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  value={jobData.companyName} 
                  onChange={handleChange} 
                  required 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package" className="text-white">Package/Salary *</Label>
                <Input 
                  id="package" 
                  name="package" 
                  value={jobData.package} 
                  onChange={handleChange} 
                  placeholder="e.g. ₹10-12 LPA" 
                  required 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link" className="text-white">Application Link *</Label>
                <Input 
                  id="link" 
                  name="link" 
                  type="url" 
                  value={jobData.link} 
                  onChange={handleChange} 
                  placeholder="https://..." 
                  required 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-white">Branch (Optional)</Label>
                <Input 
                  id="branch" 
                  name="branch" 
                  value={jobData.branch} 
                  onChange={handleChange} 
                  placeholder="e.g. Computer Science" 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Role (Optional)</Label>
                <Input 
                  id="role" 
                  name="role" 
                  value={jobData.role} 
                  onChange={handleChange} 
                  placeholder="e.g. Software Engineer" 
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastDate" className="text-white">Last Date to Apply *</Label>
                <Input 
                  id="lastDate" 
                  name="lastDate" 
                  type="date" 
                  value={jobData.lastDate} 
                  onChange={handleChange} 
                  min={new Date().toISOString().split('T')[0]} 
                  required 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="border-gray-600 text-white bg-gray-700 hover:text-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Job Posting</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white">Are you sure you want to delete this job posting?</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-gray-600 text-white bg-gray-700 hover:text-blue-400"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteJob}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page