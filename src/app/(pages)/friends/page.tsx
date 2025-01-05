"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import { Button } from "@/components/generic/Button";
import {addFriend, getFriendsByStatus, updateFriendshipStatus} from "@/services/FriendService";

export default function Friends() {
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriends = async () => {
    try {
      const acceptedFriends = await getFriendsByStatus("ACCEPTED");
      setFriends(acceptedFriends);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const pendingRequests = await getFriendsByStatus("PENDING");
      setFriendRequests(pendingRequests);
    } catch (error) {
      console.error("Error fetching friend requests: ", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const toggleFriendMode = () => {
    setIsAddingFriend(!isAddingFriend);
  };

  const handleAddFriend = async () => {
    if (newFriendUsername) {
      try {
        const response = await addFriend(newFriendUsername);

        alert(`Friend request sent to ${response.friendUsername}`);

        setNewFriendUsername("");
        setIsAddingFriend(false);
      } catch (error) {
        console.error("Error sending friend request: ", error);
        alert("Failed to send friend request. Please try again.");
      }
    } else {
      alert("Please enter a valid username.");
    }
  };

  const handleAcceptRequest = async (username: string) => {
    const status = "ACCEPTED";
    try {
      await updateFriendshipStatus(username, status);
      alert(`Accepted friend request from ${username}`);

      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error("Failed to accept friend request: ", error);
    }
  };

  const handleDenyRequest = async (username: string) => {
    const status = "REJECTED";
    try {
      await updateFriendshipStatus(username, status);
      alert(`Denied friend request from ${username}`);

      fetchFriendRequests();
    } catch (error) {
      console.error("Failed to deny friend request: ", error);
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
          <div className="mb-2">
            <Button text="Add Friend" onClick={handleAddFriend} />
          </div>
          <Button text="Cancel" onClick={toggleFriendMode} />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-center space-x-4 mt-6 w-full">
            <div className="w-2/5 p-6 rounded-lg bg-background_secondary">
              <h1 className="mb-2">Friends</h1>
              {friends.map(({friendUsername, profilePictureUrl}, index) => (
                <div className="flex items-center" key={index}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={profilePictureUrl}
                      alt={`${friendUsername}`}
                      className="w-14 h-14 object-cover rounded-full"
                    />
                    <label className="block text-m font-medium">{friendUsername}</label>
                  </div>
                </div>
              ))}
            </div>
            {friendRequests.length > 0 && (
              <div className="w-2/5 p-8 rounded-lg bg-background_secondary">
                <h1 className="mb-2">Friend Requests</h1>
                {friendRequests.map(({profilePictureUrl, friendUsername}, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="flex items-center space-x-4">
                      <img
                        src={profilePictureUrl}
                        alt={`${friendUsername}`}
                        className="w-14 h-14 object-cover rounded-full"
                      />
                      <label className="block text-m font-medium">{friendUsername}</label>
                    </div>
                    <div className="flex space-x-2 ml-auto">
                      <Image src="/checkmark.svg" width={30} height={30} alt="checkmark"
                             className="hover:cursor-pointer"
                             onClick={() => handleAcceptRequest(friendUsername)}/>
                      <Image src="/red-cross.svg" width={35} height={35} alt="red cross"
                             className="hover:cursor-pointer"
                             onClick={() => handleDenyRequest(friendUsername)}/>
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
