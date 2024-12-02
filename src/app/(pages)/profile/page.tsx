"use client";

import {Button} from "@/components/generic/Button";
import {useState} from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    profilePictureURL: "https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?" +
      "region=273%2C0%2C951%2C536",
    username: "ViesBotje",
    email: "botje@gmail.com",
    password: "password123"
  }); // TODO: Make this so it takes everything from the user.
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));

    if ((name === "username" && value.length < 5) || (name === "password" && value.length < 8 )) {
      setIsSaveDisabled(true)
    } else {
      const isInvalid =
        (name !== "username" && profileData.username.length < 5) ||
        (name !== "password" && profileData.password.length < 8);
      setIsSaveDisabled(isInvalid);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      if (isSaveDisabled) {
        alert("Please make sure username is minimal 5 characters and password is minimal 8 long.")
        return;
      }
      console.log("Saved profile data:", profileData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-sm p-6 rounded-lg mt-6 bg-slate-600">
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
            <label className="block text-m text-red-500">
              Username must be at least 5 characters
            </label>
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
            <label className="block text-m font-medium mt-4">
              Password
            </label>
            <input
              type="password"
              name="password"
              minLength={8}
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