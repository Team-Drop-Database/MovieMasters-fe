"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import { Button } from "@/components/generic/Button";
import {addFriend, deleteFriend, getFriendsByStatus, updateFriendshipStatus} from "@/services/FriendService";
import {useAuthContext} from "@/contexts/AuthContext";
import neutral from "@/assets/images/no-profile-pic.jpg";

export default function Friends() {
  const {userDetails} = useAuthContext();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, [userDetails]);

  const fetchFriends = async () => {
    try {
      const acceptedFriends = await getFriendsByStatus("ACCEPTED");
      setFriends(acceptedFriends);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const pendingRequests = await getFriendsByStatus("PENDING");

      if (userDetails) {
        const filteredRequests = pendingRequests.filter((request: { username: string; }) =>
          request.username !== userDetails.username!);
        setFriendRequests(filteredRequests);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
          setError(error.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    } else {
      setError("Invalid username");
    }
  };

  const handleAcceptRequest = async (username: string) => {
    const status = "ACCEPTED";
    try {
      await updateFriendshipStatus(username, status);

      fetchFriends();
      fetchFriendRequests();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDenyRequest = async (username: string) => {
    const status = "REJECTED";
    try {
      await updateFriendshipStatus(username, status);

      fetchFriendRequests();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleDeleteFriend = async (username: string) => {
    try {
      await deleteFriend(username);
      alert(`${username} has been succesfully deleted.`);

      fetchFriends();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div>{error}</div>
      )}
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
              {friends.map(({friendUsername, friendProfilePicture}, index) => (
                <div className="flex items-center mb-2" key={index}>
                  <div className="flex items-center space-x-4">
                    <div className="w-[55px] h-[55px] relative">
                      <Image
                        src={friendProfilePicture || neutral}
                        alt={`${friendUsername}`}
                        fill
                        sizes="55px"
                        className="object-cover rounded-full"
                      />
                    </div>
                    <label className="block text-m font-medium">{friendUsername}</label>
                  </div>
                    <div className="flex space-x-2 ml-auto">
                      <Image
                        src="/delete.svg"
                        alt="Delete"
                        width={25}
                        height={25}
                        className="hover:cursor-pointer"
                        onClick={() => handleDeleteFriend(friendUsername)}
                      />
                    </div>
                </div>
              ))}
            </div>
            {friendRequests.length > 0 && (
              <div className="w-2/5 p-8 rounded-lg bg-background_secondary">
                <h1 className="mb-2">Friend Requests</h1>
                {friendRequests.map(({friendProfilePicture, friendUsername}, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="w-[55px] h-[55px] relative">
                        <Image
                          src={friendProfilePicture || neutral}
                          alt={`${friendUsername}`}
                          fill
                          sizes="55px"
                          className="object-cover rounded-full"
                        />
                      </div>
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
