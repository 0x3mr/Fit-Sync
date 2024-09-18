import Image from "next/image";
import Logo from '@/app/assets/Images/Logo.png';
import { GetServerSideProps } from "next";
import { getUserBySessionId } from "@/app/models/User";
import { getShipBySessionId, Ship, } from "@/app/models/Memberships";
import { formatDate } from "@/app/lib/utils";
import '@/app/globals.css';
import '@/app/assets/styles/video.css';
import '@/app/assets/styles/membership.css';
import { FC, useState } from "react";


type PlanOptions = {
  [key: number]: string[];
};

const ShipOptions = {
  15: ["Basic access"],
  30: ["Basic access", "Coach Followup"],
  60: ["Basic access", "Coach Followup", "Diet program"],
  90: ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access"],
  360: ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access", "24/7 support"]
}

const PlanBenfits = ["Basic access", "Coach Followup", "Diet program", "Boxing access", "Live Coach Access", "24/7 support"]



const SubsModal: FC<{ plan: string, handleModalClose: (click: any) => void }> = ({ plan, handleModalClose }) => {
  const handleModalSubs = async () => {

    try {
      const response = await fetch('/api/membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
        credentials: 'same-origin', //only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Subscription successful:', data);
        window.location.href = '/membership';
      } else {
        console.error('Subscription failed:', data.err);
        alert(`Subscription failed: ${data.err}`);
      }
    } catch (error) {
      console.error('Error occurred during Subscription:', error);
    }

    console.log("Subsc to", plan);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button type="button" className="close-modal" onClick={handleModalClose}>X</button>
        <h1>Are you sure you wanna subscribe to the plan: <span className="highlight">{plan} Days</span></h1>
        <button type="button" className="subscribeBtn" onClick={handleModalSubs}>Subscribe</button>
      </div>
    </div>
  );
};



const PlanTable: React.FC<{ ShipOptions: PlanOptions, handleSubscribeClick: (click: any) => void }> = ({ ShipOptions, handleSubscribeClick }) => {

  // <div className="overflow-x-auto">
  {/* <table className="min-w-full border-collapse border border-gray-300 rounded-full"> */ }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <table className="table-auto w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Plan</th>
            {PlanBenfits.map((option, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">{option}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(ShipOptions).map((plan) => (
            <tr key={plan}>
              <td
                className="border border-gray-300 px-4 py-2 cursor-pointer btnhh"
                onClick={() => handleSubscribeClick(plan)}
              >{plan} Days</td>
              {PlanBenfits.map((option) => (
                <td
                  key={option}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  {ShipOptions[plan].includes(option) ? (
                    <span className="text-green-500">✔</span>
                  ) : (
                    <span className="text-red-500">✘</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default function Home({ data }: { data: Ship }) {
  const [showModal, setShowModal] = useState(false);
  const [plan, setPlan] = useState("");
  const [ShowPlans, setShowPlans] = useState(false);


  function onSubscribe(plan: string): void {
    setPlan(plan);
    console.log(plan);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function ShowPlansT() {
    setShowPlans(true);
  }

  return (
    <div>
      <div className="videoBackground">
        <video autoPlay loop muted className="video">
          <source src='/assets/Videos/BlackFading.mp4' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Image
            src={Logo}
            alt="Logo"
            className="logo w-[60%] mt-20 md:mt-0 md:w-full"
            priority
          />
        </main>
      </div>
      <div className="content">
        {data ? (
          <div>
            <h1>Membership Status</h1>
            <p>Membership Status: {data.status}</p>
            <p>Membership Type: {data.type}</p>
            <p>Started on: {formatDate(data.start)}</p>
            <p>Ends on: {formatDate(data.end)}</p>
            <p>Pauses left: {data.pause_limit}</p>
            {ShowPlans ? (
              <div>
                <br></br>
                <br></br>
                <PlanTable ShipOptions={ShipOptions} handleSubscribeClick={onSubscribe} />
              </div>
            ) : (
              <div>
                <button type="button" className="subscribeBtn" onClick={ShowPlansT}>Change Membership</button>
              </div>
            )}
          </div>

        ) : (
          <div>
            <h1>You aren't subscribed in any Membership</h1>
            <p>You can subscribe to these available Memberships:</p>
            <br></br>
            <br></br>
            <PlanTable ShipOptions={ShipOptions} handleSubscribeClick={onSubscribe} />
          </div>
        )}


      </div>
      {showModal && (
        <SubsModal plan={plan} handleModalClose={closeModal} />
      )}
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie;
  let data = null;

  if (cookies) {
    const cookie = require("cookie"); // Use the cookie package to parse cookies
    const parsedCookies = cookie.parse(cookies);
    const sessionID = parsedCookies.sessionID;
    console.log("SSSSSSS", sessionID);

    if (sessionID) {
      const user = await getShipBySessionId(sessionID);
      console.log(user);
      if (!user.err) data = user.ship;
    }
  }

  return {
    props: {
      data: data || null,
    },
  };
};