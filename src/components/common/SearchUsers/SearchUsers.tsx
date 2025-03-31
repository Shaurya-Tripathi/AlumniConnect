import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

function SearchUsers({ setSearchInp }) {
  return (
    <div className='pb-4 flex justify-center items-center gap-4'>
      <Input
        className='w-2/4'
        placeholder='Search Users....'
        onChange={(e) => {
          setSearchInp(e.target.value);
        }}
      />
    </div>
  );
}

export default SearchUsers;
