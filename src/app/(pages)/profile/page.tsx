"use client";

import {Button} from "@/components/generic/Button";
import {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import {navigateToLogin} from "@/utils/navigation/HomeNavigation";
import Loading from "@/components/generic/Loading";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {fetchUserDataService, updateUser} from "@/services/UserService";

export default function Profile() {
  const {isLoggedIn, userDetails, login} = useAuthContext();
  const [isEditing, setIsEditing] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePictureURL: "",
    username: "",
    email: ""
  });
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      navigateToLogin();
    }

    async function fetchUserData() {
      try {
        // @ts-expect-error userDetails could possibly be null, which is not the case
        const userData = await fetchUserDataService(userDetails.username);
        const initialData = {
          username: userData.username,
          email: userData.email,
          profilePictureURL: userData.profile_picture || "https://static.vecteezy.com/system" +
            "/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
          //TODO: issue #97 (make sure there is already image in database)
        };
        setProfileData(initialData);
        // @ts-expect-error says that initialData could not be assigned to originalData but it's the same
        setOriginalData(initialData); // This is to make sure that when you cancel editting you get the original data back
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          // @ts-expect-error argument of string is not assignable, but it works
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [isLoggedIn, userDetails]);

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // @ts-expect-error e has type of any
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProfileData((prevData) => ({...prevData, [name]: value}));

    if ((name === "username" && value.length < 5)) {
      setIsSaveDisabled(true)
    } else {
      const isInvalid = (name !== "username" && profileData.username.length < 5);
      setIsSaveDisabled(isInvalid);
    }
  };

  async function toggleEditMode() {
    if (isEditing) {
      if (isSaveDisabled) {
        alert("Please make sure username is 5 or more characters."); // TODO veranderen zonder alert
        return;
      }

      try {
        // @ts-expect-error userDetails possibly null, without userDetails you can't get to this page
        const tokens = await updateUser(userDetails.userId, {
          username: profileData.username,
          email: profileData.email,
          profilePicture: profileData.profilePictureURL
        });

        if (tokens) {
          Cookies.set("jwt", tokens.accessToken, {expires: 1, secure: true, sameSite: "Strict"});
          Cookies.set("refresh_token", tokens.refreshToken,
            {expires: 3, secure: true, sameSite: "strict"});
          await login();
          router.push("/");
        }

        alert("Profile updated succesfully!");
        
        // @ts-expect-error argument of type ... is not assignable, but it's the same
        setOriginalData(profileData);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error updating profile: ", error.message);
          alert("Failed to update profile. Please try again.");
        }
      }
    }

    setIsEditing(!isEditing);
  }

  const cancelEdit = () => {
    // @ts-expect-error argument of type null is not assignable, originalData is not null
    setProfileData(originalData);
    setIsEditing(false);
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6 bg-background_secondary">
        <div className="flex justify-center items-center">
          <img
            src={profileData.profilePictureURL}
            alt="Profile picture"
            className="w-40 h-40 object-cover rounded-full"
          />
        </div>
        {isEditing ? (
          <div className="m-2">
            <label className="block text-m font-medium">
              Profile Picture URL
            </label>
            <input
              type="text"
              name="profilePictureURL"
              value={profileData.profilePictureURL}
              onChange={handleInputChange}
              className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)] w-full"
            />
            <label className="block text-m font-medium mt-4">
              Username
            </label>
            <input
              type="text"
              name="username"
              minLength={5}
              value={profileData.username}
              onChange={handleInputChange}
              className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)] w-full"
            />
            {profileData.username.length < 5 && (
              <label className="block text-m text-red-500">
                Username must be at least 5 characters
              </label>
            )}
            <label className="block text-m font-medium mt-4">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="outline-none placeholder-black py-1 px-2 h-fit rounded-md text-black bg-light_grey
                         hover:bg-light_grey_active hover:duration-300 hover:cursor-text
                         font-[family-name:var(--font-jura)] w-full"
            />
          </div>
        ) : (
          <div>
            <p className="m-2 text-center font-medium">
              {profileData.username}
            </p>
            <p className="m-2 text-center font-medium">
              {profileData.email}
            </p>
          </div>
        )}
        <div className="ml-10 mr-10 mt-5">
          <Button
            text={isEditing ? "Save" : "Edit"}
            onClick={toggleEditMode}
          />
        </div>
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