"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/generic/Button";

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
  ];

  const [isAddingFriend, setIsAddingFriend] = useState(false); // State to toggle between views
  const [newFriendUsername, setNewFriendUsername] = useState(""); // State to hold input value

  const toggleFriendMode = () => {
    setIsAddingFriend(!isAddingFriend);
  };

  const handleAddFriend = () => {
    if (newFriendUsername.trim()) {
      // Add your logic here to add a friend (like an API call)
      alert(`Added ${newFriendUsername} as a friend!`);
      setNewFriendUsername(""); // Reset input
      setIsAddingFriend(false); // Go back to friends list
    } else {
      alert("Please enter a valid username.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isAddingFriend ? (
        <div className="w-full max-w-sm p-6 rounded-lg bg-background_secondary mt-6">
          <h1 className="mb-2">Add Friend</h1>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              placeholder="Enter friend's username"
              className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)] w-full"
            />
          </div>
          <Button text="Add Friend" onClick={handleAddFriend} />
        </div>
      ) : (
        <>
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
          <div className="ml-10 mr-10 mt-5">
            <Button text="Add Friend" onClick={toggleFriendMode} />
          </div>
        </>
      )}
    </div>
  );
}
