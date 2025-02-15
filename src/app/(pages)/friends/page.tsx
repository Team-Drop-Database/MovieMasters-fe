"use client";

import React, {useEffect, useState} from "react";
import Image from "next/image";
import { Button } from "@/components/generic/Button";
import {addFriend, deleteFriend, getFriendsByStatus, updateFriendshipStatus} from "@/services/FriendService";
import {useAuthContext} from "@/contexts/AuthContext";
import neutral from "@/assets/images/no-profile-pic.jpg";
import SuccessAlert from "@/components/generic/alert/SuccessAlert";
import ConfirmDialog from "@/components/generic/alert/ConfirmDialog";
import BasicTransitionLink from "@/components/generic/transitions/BasicTransitionLink";
import TextInput from "@/components/generic/TextInput";
import DeleteIcon from "@/assets/images/delete/delete.svg"

export default function Friends() {
  const {userDetails} = useAuthContext();
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userDetails === null) {
      return;
    }

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

        // alert(`Friend request sent to ${response.friendUsername}`);
        setSuccessMessage(`Friend request sent to ${response.friendUsername}`);
        setShowSuccessAlert(true);

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
    // Show the confirmation dialog
    setSelectedUsername(username);
    setIsConfirmDialogVisible(true);
  };

  const confirmDeleteFriend = async () => {
    if (!selectedUsername) return;

    try {
      await deleteFriend(selectedUsername);
      fetchFriends();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsConfirmDialogVisible(false);
      setSelectedUsername(null);
    }
  };

  const cancelDeleteFriend = () => {
    setIsConfirmDialogVisible(false);
    setSelectedUsername(null);
  };

  return (
    <div className="flex flex-col items-center">
      {showSuccessAlert && (
        <SuccessAlert message={successMessage} onClose={() => setShowSuccessAlert(false)}/>
      )}
      {isConfirmDialogVisible && (
        <ConfirmDialog
          message={`Are you sure want to delete ${selectedUsername} as a friend?`}
          onConfirm={confirmDeleteFriend}
          onCancel={cancelDeleteFriend}
        />
      )}
      {isAddingFriend ? (
        <div className="w-full max-w-sm p-6 rounded-lg bg-background_secondary mt-6">
          <h1 className="mb-2">Add Friend</h1>
          <div className="flex items-center space-x-4 mb-4">
            <TextInput value={newFriendUsername} onChange={setNewFriendUsername} placeholder="Enter friend's username" className="w-full" />
          </div>
          <div className="mb-2">
            <Button text="Add Friend" onClick={handleAddFriend} />
          </div>
          <Button text="Cancel" onClick={toggleFriendMode} />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-4 sm:space-y-0 mt-6 w-full">
            <div className="sm:w-2/5 w-full p-4 sm:p-6 rounded-lg bg-background_secondary">
            <h1 className="mb-2 sm:text-left">Friends</h1>
              {friends.length == 0 ? <p className="font-inter text-md">You don&#39;t have any friends added. Add some friends to see each others watchlist!</p> : ""}
              {friends.map(({friendUsername, friendProfilePicture, userId, friendId}, index) => (
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
                    <div className="flex space-x-2 ml-auto ">
                    <BasicTransitionLink href={`/mywatchlist?name=${friendUsername}&userid=${userDetails?.userId == userId ? friendId : userId}`}>
                    <div className="px-2 bg-blue-500 hover:bg-indigo-500 transition-all hover:scale-105 rounded-md">Watchlist</div>
                  </BasicTransitionLink>
                      <Image
                        src={DeleteIcon}
                        alt="Delete"
                        width={25}
                        height={25}
                        className="hover:cursor-pointer hover:scale-110 transition-transform hover:shadow-xl" title="Remove from friendlist?"
                        onClick={() => handleDeleteFriend(friendUsername)}
                      />
                    </div>
                </div>
              ))}
            </div>
            {friendRequests.length > 0 && (
              <div className="sm:w-2/5 w-full p-4 sm:p-6 rounded-lg bg-background_secondary">
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
      {error && (
        <div className="text-red-500">{error}</div>
      )}
    </div>
  );
}
