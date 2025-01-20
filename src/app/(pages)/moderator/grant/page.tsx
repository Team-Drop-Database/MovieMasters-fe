"use client"
import React from "react"
import { useAuthContext } from "@/contexts/AuthContext"
import { redirect } from "next/navigation"
import TextInput from "@/components/generic/TextInput"
import { Button } from "@/components/generic/Button"
import { Role, User } from "@/models/User"
import { fetchUserByEmail, fetchUserData, updateUserRole } from "@/services/UserService"
import NoPicture from "@/assets/images/no-profile-pic.jpg"
import Image from "next/image"
import AddMod from "@/assets/images/mod/add/add_mod.svg"
import AddModActive from "@/assets/images/mod/add/add_mod_active.svg"
import RemoveMod from "@/assets/images/mod/remove/remove_mod.svg"
import RemoveModActive from "@/assets/images/mod/remove/remove_mod_active.svg"
import ConfirmDialog from "@/components/generic/alert/ConfirmDialog"

export default function GrantRightsPage() {
  const { isModerator, loading } = useAuthContext()
  const [inputValue, setInputValue] = React.useState("")
  const [foundUser, setFoundUser] = React.useState<User | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [userIsHovered, setUserIsHovered] = React.useState(false)
  const [icon, setIcon] = React.useState(AddMod)
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

  async function searchUser() {
    let user: User
    try {
      if (inputValue.includes("@")) {
        user = await fetchUserByEmail(inputValue)
      } else {
        user = await fetchUserData(inputValue)
      }
      setFoundUser(user)
      setErrorMessage(null)
    } catch (exception: unknown) {
      setFoundUser(null)
      setErrorMessage((exception as Error).message)
    }
  }

  async function confirmRoleUpdate() {
    if (foundUser === null) { return }
    const foundIsMod = foundUser.role === Role.ROLE_MOD
    const newRole = foundIsMod ? Role.ROLE_USER : Role.ROLE_MOD
    await updateUserRole(foundUser.id, newRole)
    setShowConfirmDialog(false)
    searchUser()
  }

  React.useEffect(() => {
    if (!loading) {
      if (!isModerator) {
        redirect('/');
      }
    }
  }, [loading]);

  React.useEffect(() => {
    if (foundUser === null) { return }
    const foundIsMod = foundUser.role === Role.ROLE_MOD
    if (foundIsMod && userIsHovered) {
      setIcon(RemoveModActive)
    } else if (foundIsMod) {
      setIcon(RemoveMod)
    } else if (userIsHovered) {
      setIcon(AddModActive)
    } else {
      setIcon(AddMod)
    }
  }, [foundUser, userIsHovered])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col bg-background_primary rounded-xl p-4 gap-2">
        <p>Grant moderator rights to:</p>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          placeholder="Username / Email"
        />
        <Button text="Search" onClick={searchUser} />
        { errorMessage && <p className="text-red-500">{errorMessage}</p> }
        { foundUser && (
          <div
            className="flex rounded-md hover:bg-neutral-700 hover:cursor-pointer duration-300 gap-2 items-center"
            onClick={() => setShowConfirmDialog(true)}
            onMouseEnter={() => setUserIsHovered(true)}
            onMouseLeave={() => setUserIsHovered(false)}
          >
            <Image
              src={foundUser.profile_picture || NoPicture}
              alt="Profile picture"
              width={50}
              height={50}
              className="rounded-md"
            />
            <p className="details grow">{foundUser.username}</p>
            <Image
              src={icon}
              alt="Change mod icon"
            />
          </div>
        )}
      </div>
      { showConfirmDialog && foundUser && (
        <ConfirmDialog
          message={`Are you sure you want to update ${foundUser.username}'s rights?`}
          onConfirm={confirmRoleUpdate}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  )
}
