'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          Splitwise Clone
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/dashboard" className="text-white mr-4">
                Dashboard
              </Link>
              <Link href="/groups" className="text-white mr-4">
                Groups
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-white text-blue-500 px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-white mr-4">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-blue-500 px-4 py-2 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

