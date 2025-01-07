"use client";

import { Button } from "@/components/generic/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { navigateToLogin } from "@/utils/navigation/HomeNavigation";
import Loading from "@/components/generic/Loading";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {deleteUser, fetchUserData, updateUser, uploadImageToImgbb} from "@/services/UserService";
import neutral from "@/assets/images/no-profile-pic.jpg"

export default function Profile() {
  const profile = {
    profilePictureUrl: "",
    username: "",
    email: ""
  }
  const {isLoggedIn, userDetails, login, logout} = useAuthContext();
  const [isEditing, setIsEditing] = useState(false)
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
          setOriginalData(initialData);
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

  async function handleDeleteUser(userID: number | undefined) {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? " +
      "This action cannot be undone.");

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteUser(userID);
      alert("Your account has been succesfully deleted.");

      logout();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting account: ", error.message);
        setError(error.message);
      } else {
        console.error("An unkown error occured.");
      }
    }
  }

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
        <div className="ml-10 mr-10 mt-5">
          <Button
            text={isEditing ? "Save" : "Edit"}
            onClick={toggleEditMode}
          />
        </div>
        {!isEditing && (
          <div className="ml-10 mr-10 mt-5">
            <button
              onClick={() => handleDeleteUser(userDetails?.userId)}
              className="w-full shadow-md rounded px-3 py-1 bg-red-600 hover:bg-red-700 hover:duration-300
              duration-300 hover:cursor-pointer font-[family-name:var(--font-alatsi)] text-xl"
            >
              Delete Account
            </button>
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
    </div>
  );
}
