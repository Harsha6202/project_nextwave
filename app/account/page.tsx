import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import AccountPage from "@/components/account-page"

export const metadata = {
  title: "Account Settings",
  description: "Manage your account settings",
}

export default async function Account() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return <AccountPage user={user} />
}
