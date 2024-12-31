"use client";

import Image from "next/image";
import React from "react";

export default function Friends() {
  // Temporary hardcoded data (can be replaced with API data)
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

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6 bg-background_secondary">
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
              <Image src={'/checkmark.svg'} width={30} height={30} alt="checkmark" />
              <Image src={'/red-cross.svg'} width={35} height={35} alt="red cross" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
