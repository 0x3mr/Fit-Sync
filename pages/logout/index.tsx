import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { logoutUser } from "@/app/models/User";
import '@/app/globals.css';

export default function Home({ state }: { state: string }) {
  console.log(state);
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      router.push('/');
    };

    redirect();
  }, [router]);

  return null; // Optionally, you can return a loading message or spinner while redirecting
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