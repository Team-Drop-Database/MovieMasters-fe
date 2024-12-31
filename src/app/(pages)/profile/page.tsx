"use client";

import { Button } from "@/components/generic/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { navigateToLogin } from "@/utils/navigation/HomeNavigation";
import Loading from "@/components/generic/Loading";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {fetchUserData, updateUser} from "@/services/UserService";
import Image from "next/image";
import {fetchUserData, updateUser, uploadImageToImgbb} from "@/services/UserService";
import neutral from "@/assets/images/no-profile-pic.jpg"

export default function Profile() {
  const profile = {
    profilePictureUrl: "",
    username: "",
    email: ""
  }
  const {isLoggedIn, userDetails, login} = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [profileData, setProfileData] = useState(profile);
  const [originalData, setOriginalData] = useState(profile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // To hold the file object
  const router = useRouter();
  const JWT_COOKIE_SECURE: boolean =
    process.env.JWT_COOKIE_SECURE?.toLowerCase() === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      navigateToLogin();
    }

    async function fetchUserDataProfile() {
      if (userDetails != null) {
        try {
          const userData = await fetchUserData(userDetails.username);
          const initialData = {
            username: userData.username,
            email: userData.email,
            profilePictureUrl: userData.profile_picture || neutral.src
          };
          setProfileData(initialData);
          setOriginalData(initialData); // This is to make sure that when you cancel editting you get the original data back
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
            setError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchUserDataProfile();
  }, [isLoggedIn, userDetails]);

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size limit
      if (file.size > 1.4 * 1024 * 1024) { // 1.4MB limit
        alert("File size must be less than 1.4MB.");
        return;
      }
      setSelectedFile(file);
      // Update profile picture preview
      setProfileData((prevData) => ({
        ...prevData,
        profilePictureUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "username" && value.length < 5) {
      setIsSaveDisabled(true);
    } else {
      const isInvalid = name !== "username" && profileData.username.length < 5;
      setIsSaveDisabled(isInvalid);
    }
  };

  async function toggleEditMode() {
    if (isEditing) {
      if (isSaveDisabled) {
        alert("Please make sure username is 5 or more characters.");
        return;
      }

      if (userDetails != null) {
        try {
          let profilePictureUrl = profileData.profilePictureUrl;

          // If a new file is selected, upload it
          if (selectedFile) {
            const uploadedUrl = await uploadImageToImgbb(selectedFile);
            if (uploadedUrl) {
              profilePictureUrl = uploadedUrl;
            }
          }

          const tokens = await updateUser(userDetails.userId, {
            username: profileData.username,
            email: profileData.email,
            profilePicture: profilePictureUrl,
          });

          if (tokens) {
            Cookies.set("jwt", tokens.accessToken, {
              expires: 1,
              secure: JWT_COOKIE_SECURE,
              sameSite: "Strict",
            });
            Cookies.set("refresh_token", tokens.refreshToken, {
              expires: 3,
              secure: JWT_COOKIE_SECURE,
              sameSite: "strict",
            });
            await login();
            router.push("/");
          }

          setOriginalData({ ...profileData, profilePictureUrl: profilePictureUrl });
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error updating profile: ", error.message);
            alert("Failed to update profile. Please try again.");
          }
        }
      }
    }

    setIsEditing(!isEditing);
  }

  const cancelEdit = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setSelectedFile(null);
  };

  const toggleFriendMode = () => {
    if (isAddingFriend) {
      console.log("Adding friend.")
    }
    setIsAddingFriend(!isAddingFriend);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6 bg-background_secondary">
        <div className="flex justify-center items-center relative group">
          <div className="relative">
            <img
              src={profileData.profilePictureUrl}
              alt="Profile picture"
              className="w-40 h-40 object-cover rounded-full"
            />
            {isEditing && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <span className="text-white font-medium text-md">Edit</span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
    {/*<div className="flex justify-center mb-5">*/}
    {/*  <div className="w-full max-w-sm p-6 rounded-lg mt-6 m-2 bg-background_secondary">*/}
    {/*    <div className="flex justify-center items-center">*/}
    {/*      <img*/}
    {/*        src={profileData.profilePictureURL}*/}
    {/*        alt="Profile picture"*/}
    {/*        className="w-40 h-40 object-cover rounded-full"*/}
          />
        </div>

        {isEditing ? (
          <div className="m-2">
            <label className="block text-m font-medium mt-4">Username</label>
            <input
              type="text"
              name="username"
              minLength={5}
              value={profileData.username}
              onChange={handleInputChange}
              className="outline-none py-1 px-2 h-fit rounded-md bg-light_grey hover:bg-light_grey_active w-full"
            />
            <label className="block text-m font-medium mt-4">E-mail</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="outline-none py-1 px-2 h-fit rounded-md bg-light_grey hover:bg-light_grey_active w-full"
            />
          </div>
        ) : (
          <div>
            <p className="m-2 text-center font-medium">{profileData.username}</p>
            <p className="m-2 text-center font-medium">{profileData.email}</p>
          </div>
        )}
        {isAddingFriend && (
          <div className="m-2">
            <label className="block text-m font-medium mt-4">
              Add friend&#39;s Username
            </label>
            <input
              type="text"
              name="friendUsername"
              placeholder="Friend's Username"
              // onChange={handleInputChange}
              className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)] w-full"
            />
          </div>
        )}
        {!isAddingFriend && (
          <div className="m-10">
            <Button
              text={isEditing ? "Save" : "Edit"}
              onClick={toggleEditMode}
            />
          </div>
        )}
        {!isEditing && (
          <div className="m-10">
            <Button
              text={isAddingFriend ? "Send  friend request" : "Add friend"}
              onClick={toggleFriendMode}
            />
            {isAddingFriend && (
              <div className="mt-5">
                <Button
                  text="Cancel"
                  onClick={toggleFriendMode}
                />
              </div>
            )}
          </div>
        )}
        {isEditing && (
          <div className="ml-10 mr-10 mt-5">
            <Button
              text="Cancel"
              onClick={cancelEdit}/>
          </div>
        )}
      </div>
      <div className="w-full max-w-sm p-6 rounded-lg mt-6 bg-background_secondary m-2">
        <h1 className="mb-2">Friend requests</h1>
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <img
              src={profileData.profilePictureURL}
              alt="Profile picture"
              className="w-14 h-14 object-cover rounded-full"
            />
            <label className="block text-m font-medium">Username</label>
          </div>
          <div className="flex space-x-2 ml-auto">
            <Image src={'/checkmark.svg'} width={30} height={30} alt="checkmark"/>
            <Image src={'/red-cross.svg'} width={35} height={35} alt="redcross"/>
          </div>
        </div>
      </div>
    </div>
  );
}
