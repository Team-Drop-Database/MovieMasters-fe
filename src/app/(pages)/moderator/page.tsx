"use client";

import {useEffect} from "react";
import {useAuthContext} from "@/contexts/AuthContext";
import {Role} from "@/models/Role";
import {redirect} from "next/navigation";
import Link from "next/link";

export default function Moderator(){
  const {isLoggedIn, userDetails, loading} = useAuthContext();


  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        redirect('/');
      } else if (userDetails === null) {
        redirect('/');
      } else if (userDetails.role !== Role.ROLE_MOD) {
        redirect('');
      }
    }

  }, [loading]);

  return(
    <div>
      <div id="menu" className="bg-black w-full">
        <Link href="moderator/addmovie">Add movie</Link>
      </div>
    </div>
  )
}