import { AddConnection, getAllUsers, removeConnection } from '@/app/api/(client-side)/firestoreAPI';
import React, { useEffect, useState, useCallback } from 'react';
import ConnectedUsers from './ConnectedUsers';
import SearchUsers from '../common/SearchUsers/SearchUsers';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ResultantUser from '../common/SearchUsers/resultUser';
import { Toggle } from '../ui/toggle';

function ConnectionComponent({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [searchInp, setSearchInp] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const getCurrentUser = (id) => {
        console.log(id);
        AddConnection(currentUser?.userId, id);
    };

    

    const handleDisconnect = (id) => {
        console.log("Disconnecting from:", id);
        removeConnection(currentUser?.userId, id);
    };

    const handleSearch = useCallback(() => {
        if (searchInp.length !== 0) {
            setFilteredUsers(
                users.filter((user) =>
                    user?.name.toLowerCase().includes(searchInp.toLowerCase()) || 
                    user?.branchInfo?.toLowerCase().includes(searchInp.toLowerCase())
                )
            );
        } else {
            setFilteredUsers(users);
        }
    }, [searchInp, users]);
    

    useEffect(() => {
        const debounced = setTimeout(handleSearch, 500);
        return () => clearTimeout(debounced);
    }, [handleSearch]);

    useEffect(() => {
        getAllUsers(setUsers);
    }, []);

    return (
        <div className='text-white text-center pt-10 relative'>
                <SearchUsers setSearchInp={setSearchInp} />
            <div className='grid grid-cols-[auto_auto] justify-center items-center gap-10'>
                {filteredUsers.map((user) =>
                    user.id === currentUser.userId ? null : (
                        <ConnectedUsers
                            key={user.id}
                            user={user}
                            currentUser={currentUser}
                            getCurrentUser={getCurrentUser}
                            handleDisconnect={handleDisconnect}
                        />
                    )
                )}
            </div>

            {/* Conditionally render the search result box */}
            {searchInp.length !== 0 && (
                <div className="bg-black text-white p-2 absolute top-24 left-1/2 transform -translate-x-1/2 w-2/4 shadow-lg rounded-lg max-h-72 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="p-2 text-center">No results found</div>
                    ) : (
                        filteredUsers
                            .filter((user) => user?.id !== currentUser.userId)
                            .slice(0, 10)
                            .map((user) => (
                                <ResultantUser
                                    key={user.id}
                                    user={user}
                                    currentUser={currentUser}
                                    handleDisconnect={handleDisconnect}
                                    handleConnect={getCurrentUser}
                                    searchInp={searchInp}
                                />
                            ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ConnectionComponent;
