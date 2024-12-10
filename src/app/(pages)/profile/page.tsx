"use client";

import {Button} from "@/components/generic/Button";
import {useEffect, useState} from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import {navigateToLogin} from "@/utils/navigation/HomeNavigation";
import Loading from "@/components/generic/Loading";
import * as process from "node:process";
import Cookies from "js-cookie";

export default function Profile() {
  const { isLoggedIn, userDetails } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false)
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePictureURL: "",
    username: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("jwt");

  useEffect(() => {
    if (!isLoggedIn) {
      navigateToLogin();
    }

    const fetchUserData = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
        setProfileData({
          profilePictureURL: userData.profilePictureUrl || null, // TODO Find a way to have a default picture when empty
          username: userData.username || "",
          email: userData.email || ""
         });
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error(err.message);
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
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));

    if ((name === "username" && value.length < 5)) {
      setIsSaveDisabled(true)
    } else {
      const isInvalid = (name !== "username" && profileData.username.length < 5);
      setIsSaveDisabled(isInvalid);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      if (isSaveDisabled) {
        alert("Please make sure username is 5 or more characters.")
        return;
      }
      console.log("Saved profile data:", profileData);
    }
    setIsEditing(!isEditing);
  };

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
        <div className="m-10">
          <Button
            text={isEditing ? "Save" : "Edit"}
            onClick={toggleEditMode}
          />
        </div>
      </div>
    </div>
  );
}