import { redirect } from "next/navigation";

export function navigateToSignup() {
  redirect("/signup")
}

export function navigateToLogin() {
  redirect("/signin")
}

export function navigateToWatchlist() {
  redirect("/mywatchlist")
}
