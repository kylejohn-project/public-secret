import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  isAdminAuthenticated,
  saveAdminSession,
} from "../../services/adminAuth";


const API_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL;


export default function AdminLogin() {
  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  if (isAdminAuthenticated()) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }


  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8",
          },

          body: JSON.stringify({
            action: "adminLogin",
            username,
            password,
          }),
        });


      const result =
        await response.json();


      if (
        !result.success ||
        !result.token
      ) {
        throw new Error(
          result.message ||
            "Unable to sign in."
        );
      }


      saveAdminSession(
        result.token,
        result.expiresAt
      );


      navigate(
        "/admin",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to sign in."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">

      <div className="w-full max-w-md">

        <p className="text-xs font-bold uppercase tracking-[0.35em] text-ps-red">
          Public Secret 001
        </p>

        <h1 className="mt-5 text-5xl font-black uppercase tracking-[-0.05em]">
          Admin
          <br />
          Access
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-white/40">
          Authorized personnel only.
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-10 border border-white/10 bg-white/[0.02] p-6 md:p-8"
        >

          <div>
            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              required
              autoComplete="username"
              className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white focus:border-orange-600"
            />
          </div>


          <div className="mt-6">

            <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              required
              autoComplete="current-password"
              className="input h-14 w-full rounded-none border-white/10 bg-white/[0.03] text-white focus:border-orange-600"
            />

          </div>


          {error && (
            <div className="mt-6 border border-red-500/20 bg-red-500/5 p-4">

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            className="btn mt-8 h-14 w-full rounded-none border-0 bg-ps-red text-xs font-bold text-white hover:bg-ps-red-hover"
          >
            {loading
              ? "SIGNING IN..."
              : "SIGN IN"}
          </button>

        </form>

      </div>

    </main>
  );
}