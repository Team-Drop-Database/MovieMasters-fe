"use client";

import Image from "next/image";
import React from "react";

export default function Friends() {
  // Temporary hardcoded data (will be replaced with API data)
  const friendRequests = [
    {
      username: "JohnDoe",
      profilePictureUrl: "/profile1.jpg",
    },
    {
      username: "JaneSmith",
      profilePictureUrl: "/profile2.jpg",
    },
  ];

  const friends = [
    {
      username: "Mark",
      profilePictureUrl: "/profile3.jpg",
    },
    {
      username: "Ervin",
      profilePictureUrl: "/profile4.jpg",
    },
    {
      username: "Thomas",
      profilePictureUrl: "/profile5.jpg"
    }
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center space-x-4 mt-6 w-full">
        <div className="w-2/5 p-6 rounded-lg bg-background_secondary">
          <h1 className="mb-2">Friends</h1>
          {friends.map((friend, index) => (
            <div className="flex items-center" key={index}>
              <div className="flex items-center space-x-4">
                <img
                  src={friend.profilePictureUrl}
                  alt={`${friend.username}'s profile`}
                  className="w-14 h-14 object-cover rounded-full"
                />
                <label className="block text-m font-medium">{friend.username}</label>
              </div>
            </div>
          ))}
        </div>
        {friendRequests.length > 0 && (
          <div className="w-2/5 p-8 rounded-lg bg-background_secondary">
            <h1 className="mb-2">Friend Requests</h1>
            {friendRequests.map((friend, index) => (
              <div className="flex items-center" key={index}>
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profilePictureUrl}
                    alt={`${friend.username}'s profile`}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <label className="block text-m font-medium">{friend.username}</label>
                </div>
                <div className="flex space-x-2 ml-auto">
                  <Image src="/checkmark.svg" width={30} height={30} alt="checkmark"/>
                  <Image src="/red-cross.svg" width={35} height={35} alt="red cross"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Friend Button */}
      <button
        className="mt-6 py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
        onClick={() => alert("Add Friend functionality coming soon!")}
      >
        Add Friend
      </button>
    </div>
  );
}
