import Image from "next/image";
import Logo from '@/app/assets/Images/Logo.png';
import { GetServerSideProps } from "next";
import { getUserBySessionId } from "../app/models/User";
import '../app/globals.css';
import '../app/assets/styles/video.css';

export default function Home({ name }: { name: string }) {
  console.log(name);
  return (
    <div className="videoBackground">
      <video autoPlay loop muted className="video">
        <source src='/assets/Videos/BlackFading.mp4' type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src={Logo}
          alt="Logo"
          className="logo w-[60%] mt-20 md:mt-0 md:w-full"
          priority
        />
        <p>your name is {name}</p>
      </main>
      </div>
      <div className="content">
        {/* Add your content here */}
        <h1>Your Page Content</h1>
      </div>
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
