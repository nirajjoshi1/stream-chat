
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api"; // Assuming this function exists in your codebase
import { Link } from "react-router";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      friend.fullName?.toLowerCase().includes(query) ||
      friend.location?.toLowerCase().includes(query) ||
      friend.nativeLanguage?.toLowerCase().includes(query) ||
      friend.learningLanguage?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>

      {/* Search Input */}
      <div className="mb-6">
        <div className="join w-full">
          <input
            type="text"
            placeholder="Search friends by name, location, or language..."
            className="input input-bordered join-item w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button className="btn join-item" onClick={clearSearch}>
              ✕
            </button>
          )}
       
        </div>
      </div>

      {/* Search Results Stats */}
      {searchQuery && (
        <div className="mb-4 text-sm">
          <span>
            Found {filteredFriends.length}{" "}
            {filteredFriends.length === 1 ? "result" : "results"} for "
            {searchQuery}"
          </span>
          {filteredFriends.length > 0 && (
            <button
              className="ml-2 underline text-primary"
              onClick={clearSearch}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loadingFriends ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <FriendCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-xl font-medium mb-2">
              {searchQuery
                ? "No friends match your search"
                : "You don't have any friends yet"}
            </h3>
            <p className="text-base-content opacity-60">
              {searchQuery ? (
                <>
                  Try a different search term or{" "}
                  <button
                    className="text-primary underline"
                    onClick={clearSearch}
                  >
                    clear your search
                  </button>
                </>
              ) : (
                "Connect with other users to see them here"
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FriendCard({ friend }) {
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              {friend.profilePic ? (
                <img
                  src={friend.profilePic || "/placeholder.svg"}
                  alt={friend.fullName}
                />
              ) : (
                <div className="bg-primary text-primary-content flex items-center justify-center text-lg font-bold">
                  {getInitials(friend.fullName)}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {friend.fullName}
            </h3>

            {friend.location && (
              <p className="text-sm opacity-70 mb-1">📍 {friend.location}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {friend.nativeLanguage && (
                <span className="badge badge-outline">
                  Native: {friend.nativeLanguage}
                </span>
              )}
              {friend.learningLanguage && (
                <span className="badge badge-outline">
                  Learning: {friend.learningLanguage}
                </span>
              )}
            </div>

            {friend.bio && (
              <p className="text-sm mt-2 line-clamp-2 opacity-80">
                {friend.bio}
              </p>
            )}

            <div className="card-actions justify-end mt-4">
              <Link
                to={`/chat/${friend._id}`}
                className="btn btn-outline w-full"
              >
                Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="skeleton w-16 h-16 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="flex gap-2 mt-2">
              <div className="skeleton h-5 w-20 rounded-full"></div>
              <div className="skeleton h-5 w-20 rounded-full"></div>
            </div>
            <div className="skeleton h-4 w-full"></div>
            <div className="flex justify-end mt-4">
              <div className="skeleton h-8 w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
