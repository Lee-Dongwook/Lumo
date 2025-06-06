import React from 'react'
import { login, loginOAuth, signup } from './actions'

const AuthPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <form className="flex flex-col gap-4">
        <input
          className="border p-2"
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="off"
        />
        <input
          className="border p-2"
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button
          formAction={login}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Log in
        </button>
        <button
          formAction={signup}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Sign up
        </button>
      </form>

      <form>
        <button
          formAction={loginOAuth}
          className="mt-2 rounded bg-black px-4 py-2 text-white"
        >
          Login with Google
        </button>
      </form>
    </div>
  )
}

export default AuthPage
