import React from 'react';
import { format, isAfter, differenceInDays, startOfDay } from 'date-fns';
import Link from 'next/link';
import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobProps {
  id: string;
  companyName: string;
  package: string;
  link: string;
  branch?: string | null;
  role?: string | null;
  lastDate: Date;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobProps> = ({
  id,
  companyName,
  package: salary,
  link,
  branch,
  role,
  lastDate,
  onDelete,
}) => {
  // Convert strings to Date objects if needed and remove time component
  const deadline = new Date(lastDate);
  const today = startOfDay(new Date());
  
  // Calculate days remaining until last date (using date-fns for more reliable calculations)
  const daysRemaining = differenceInDays(deadline, today);
  
  // Check if the deadline has passed
  const isExpired = !isAfter(deadline, today);

  return (
    <div className={`rounded-lg shadow-md p-6 mb-4 border transition-shadow hover:shadow-lg ${isExpired ? 'bg-gray-800 border-gray-600' : 'bg-gray-700 border-gray-600'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{companyName}</h3>
          {role && <p className="text-gray-300 font-medium mt-1">{role}</p>}
        </div>
        <div className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium">
          {salary}
        </div>
      </div>
      
      {branch && (
        <div className="mt-2 text-gray-300">
          <span className="font-medium"></span> {branch}
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <div className={`${isExpired ? 'text-red-400' : 'text-green-400'} text-sm font-medium`}>
          {isExpired 
            ? 'Application Closed' 
            : daysRemaining === 0 
              ? 'Last day to apply!' 
              : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
          }
          <div className="text-gray-300 text-xs mt-1">
            Deadline: {format(deadline, 'MMM dd, yyyy')}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isExpired && (
            <Link 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Apply <ExternalLink size={16} />
            </Link>
          )}
          
          {/* Only show delete button for expired jobs */}
          {isExpired && (
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => onDelete(id)}
              title="Delete job posting"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;