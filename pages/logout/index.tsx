import Image from "next/image";
import Logo from '@/app/assets/Images/Logo.png';
import { GetServerSideProps } from "next";
import { logoutUser } from "@/app/models/User";
import '@/app/globals.css';

export default function Home({ state }: { state: string }) {
  console.log(state);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src={Logo}
          alt="Logo"
          className="logo w-[60%] mt-20 md:mt-0 md:w-full"
          priority
        />
        <p>you are {state}</p>
      </main>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie;
  let stat = null

  if (cookies) {
    const cookie = require("cookie"); // Use the cookie package to parse cookies
    const parsedCookies = cookie.parse(cookies);
    const sessionID = parsedCookies.sessionID;
    console.log("SSSSSSS", sessionID);

    if (sessionID) {
      const { state, err } = await logoutUser(sessionID);
      stat = state
      console.log(err, state);
    }
  }

  return {
    props: {
      state: stat || "none", // Pass user name to the page component as a prop or default to 'Guest'
    },
  };
};