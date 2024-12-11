"use client";

import {Button} from "@/components/generic/Button";
import {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import {navigateToLogin} from "@/utils/navigation/HomeNavigation";
import Loading from "@/components/generic/Loading";
import Cookies from "js-cookie";

export default function Profile() {
  const {isLoggedIn, userDetails} = useAuthContext();
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
  const token = Cookies.get("jwt");

  useEffect(() => {
    if (!isLoggedIn) {
      navigateToLogin();
    }

    const fetchUserData = async () => {
      try {
        // @ts-expect-error because eslint thinks userDetails could possibly be null, which is not the case
        const response = await fetch(`http://localhost:8080/api/v1/users/username/${userDetails.username}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data. Status: ${response.status}`);
        }

        const userData = await response.json();

        const initialData = {
          username: userData.username || "",
          email: userData.email || "",
          profilePictureURL: userData.profile_picture || ""
        };

        setProfileData(initialData);
        // @ts-expect-error needed to use this instead of ts-ignore
        setOriginalData(initialData);
      } catch (err) {
        // @ts-expect-error err is of type unkown
        console.error(err.message);
        // @ts-expect-error err is of type unkown
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

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

  const toggleEditMode = async () => {
    if (isEditing) {
      if (isSaveDisabled) {
        alert("Please make sure username is 5 or more characters.")
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${userDetails?.userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            username: profileData.username,
            email: profileData.email,
            profilePicture: profileData.profilePictureURL, // Renamed to match backend
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update profile data. Status: ${response.status}`);
        } else {
          const tokens = await response.json();

          if (tokens) {Cookies.set('jwt', tokens.accessToken, {expires: 1, secure: true, sameSite: 'Strict'});
          Cookies.set('refresh_token', tokens.refreshToken, {expires: 3, secure: true, sameSite: 'Strict'});
          }
        }
        alert("Profile updated succesfully!");
        // @ts-expect-error to leave the red lines
        setOriginalData(profileData);
      } catch (err) {
        // @ts-expect-error err is of type unkown
        console.error("Error updating profile: ", err.message);
        alert("Failed to update profile. Please try again.");
      }
    }
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    // @ts-expect-error argument of type null is not assignable, still everything works
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
        {/*/!* Using img over Image because for Image a config would be needed for all domains *!/*/}
        {/*/!* eslint-disable-next-line @next/next/no-img-element *!/*/}
        {/*<p className="m-2">*/}
        {/*  {profileData.username}*/}
        {/*</p>*/}
        {/*<p className="m-2">*/}
        {/*  {profileData.email}*/}
        {/*</p>*/}
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