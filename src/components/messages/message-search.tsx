"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useRouter, useParams } from "next/navigation";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const MessageSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<{id: string, name: string, avatar: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle search input visibility
  const toggleSearch = () => {
    setIsExpanded(prev => !prev);
    if (!isExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      // Clear search when collapsed
      setSearchQuery("");
      setResults([]);
    }
  };

  // Search functionality with case-insensitive and space-ignoring search
  useEffect(() => {
    if (!isExpanded) return;

    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Get users from Firestore
        const usersQuery = query(
          collection(firestore, "users"),
          orderBy("name"),
          limit(100) // Adjust this limit based on your user base size
        );
        
        const querySnapshot = await getDocs(usersQuery);
        
        // Process search query to standardize for comparison
        const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, '');
        
        // Filter users on the client side
        const searchResults = querySnapshot.docs
          .filter(doc => {
            const userData = doc.data();
            const userName = userData.name || "";
            // Normalize the username by removing spaces and converting to lowercase
            const normalizedName = userName.toLowerCase().replace(/\s+/g, '');
            
            return normalizedName.includes(normalizedQuery);
          })
          .map(doc => ({
            id: doc.id,
            name: doc.data().name || "Unknown",
            avatar: doc.data().pp || ""
          }));
        
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, isExpanded]);

  const handleUserClick = (userId: string) => {
    router.push(`/${params.userId}/messages/${userId}`);
    setSearchQuery(""); // Clear search after navigation
    setResults([]);
    setIsExpanded(false); // Collapse search after selection
  };

  // Close search and results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsExpanded(false);
        setResults([]);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div id="search-container" className="relative">
      {!isExpanded ? (
        <button
          onClick={toggleSearch}
          className="group px-2 py-2 rounded-md flex items-center bg-zinc-900 gap-x-2 w-full hover:bg-zinc-700/10 transition"
        >
          <Search className="w-4 h-4 text-zinc-500"/>
          <p className="font-semibold text-sm text-zinc-500 group-hover:text-zinc-600">
            Search 
          </p>
        </button>
      ) : (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            ref={inputRef}
            placeholder="Search messages"
            className="pl-8 bg-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-300 border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      
      {isExpanded && results.length > 0 && (
        <div className="absolute w-full bg-zinc-900 rounded-md overflow-hidden z-50 mt-1 shadow-lg border border-zinc-800">
          <div className="max-h-60 overflow-y-auto">
            {results.map((user) => (
              <button
                key={user.id}
                className="flex items-center gap-x-2 w-full hover:bg-zinc-800 transition p-2"
                onClick={() => handleUserClick(user.id)}
              >
                <UserAvatar
                  src={user.avatar || "/default-avatar.png"}
                  className="h-8 w-8"
                />
                <span className="text-zinc-300 text-sm">{user.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isExpanded && isLoading && (
        <div className="absolute w-full bg-zinc-900 rounded-md p-2 mt-1 text-center text-zinc-500 border border-zinc-800">
          Searching...
        </div>
      )}
      
      {isExpanded && searchQuery.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute w-full bg-zinc-900 rounded-md p-2 mt-1 text-center text-zinc-500 border border-zinc-800">
          No users found
        </div>
      )}
    </div>
  );
};