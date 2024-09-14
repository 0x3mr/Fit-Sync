import Image from "next/image";
import Logo from '@/app/assets/Images/Logo.png';
import { GetServerSideProps } from "next";
import { getUserBySessionId } from "../app/models/User";
import '../app/globals.css';

export default function Home({ name }: { name: string }) {
  console.log(name);
  return (
    <div>
      <header>OEPRATIONAL</header>
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie;
  let name = null;

  if (cookies) {
    const cookie = require("cookie"); // Use the cookie package to parse cookies
    const parsedCookies = cookie.parse(cookies);
    const sessionID = parsedCookies.sessionID;
    console.log("SSSSSSS", sessionID);

    if (sessionID) {
      const user = await getUserBySessionId(sessionID);
      console.log(user);
      if (user.user) name = `${user.user.F_name} ${user.user.L_name}`;
    }
  }

  return {
    props: {
      name: name || "Guest", // Pass user name to the page component as a prop or default to 'Guest'
    },
  };
};
