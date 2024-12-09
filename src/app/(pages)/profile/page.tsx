"use client";

import {Button} from "@/components/generic/Button";
import {useState} from "react";
// import {useAuthContext} from "@/contexts/authContext";
// import {navigateToLogin} from "@/utils/navigation/HomeNavigation";

export default function Profile() {
  // const { isLoggedIn, userDetails } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePictureURL: "https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg?" +
      "region=273%2C0%2C951%2C536",
    username: "ViesBotje",
    email: "botje@gmail.com"
  }); // TODO: Make this so it takes everything from the user.

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigateToLogin();
  //   }
  // }, [isLoggedIn])
  
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

  const toggleFriendMode = () => {
    if (isAddingFriend) {
      console.log("Adding friend.")
    }
    setIsAddingFriend(!isAddingFriend);
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
            <div className="justify-items-center">
              <p className="mt-4">Or</p>
            </div>
            <label className="block text-m font-medium mt-4">
              Add friend&#39;s e-mail
            </label>
            <input
              type="text"
              name="friendEmail"
              placeholder="Friend's e-mail"
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
      </div>
    </div>
  );
}