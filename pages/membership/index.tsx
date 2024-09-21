import Image from "next/image";
import Logo from "@/app/assets/Images/Logo.png";
import { GetServerSideProps } from "next";
import { getUserBySessionId } from "@/app/models/User";
import { getShipBySessionId, Ship } from "@/app/models/Memberships";
import { formatDate } from "@/app/lib/utils";
import "@/app/globals.css";
import "@/app/assets/styles/video.css";
import "@/app/assets/styles/membership.css";
import { ShipOptions, PlanBenfits, PlanOptions } from "@/constants/gymPlans";
import { FC, useState } from "react";
import Link from "next/link";
import { House, LayoutDashboard, Bolt, Trash, Pause,} from "lucide-react";



const SubsModal: FC<{
  data: Ship;
  plan: string;
  handleModalClose: (click: any) => void;
}> = ({ data, plan, handleModalClose }) => {
  const handleModalSubs = async () => {
    try {
      let bod = {};
      console.log(data);
      if (data){
         bod = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: plan, email: data.email }),
          credentials: "same-origin", //only for same-origin requests
        };
      }
      else {
       bod = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
        credentials: "same-origin", //only for same-origin requests
      };
      }
      const response = await fetch("/api/membership", bod)

      const Apidata = await response.json();

      if (response.ok) {
        console.log("Subscription successful:", Apidata);
        window.location.href = "/membership";
      } else {
        console.error("Subscription failed:", Apidata.err);
        alert(`Subscription failed: ${Apidata.err}`);
      }
    } catch (error) {
      console.error("Error occurred during Subscription:", error);
    }

    console.log("Subsc to", plan, data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          type="button"
          className="close-modal"
          onClick={handleModalClose}
        >
          X
        </button>
        <h1>
          Are you sure you wanna subscribe to the plan:{" "}
          <span className="highlight">{plan} Days</span>
        </h1>
        <button
          type="button"
          className="subscribeBtn"
          onClick={handleModalSubs}
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};


const DelModal: FC<{
  data: Ship;
  handleModalClose: (click: any) => void;
}> = ({ data, handleModalClose }) => {
  const handleModalSubs = async () => {
    try {

      const response = await fetch("/api/membership",
        {
          method: "DELETE",
          credentials: "same-origin", //only for same-origin requests
        },
      )

      const Apidata = await response.json();

      if (response.ok) {
        console.log("Del Membership successful:", Apidata);
        window.location.href = "/membership";
      } else {
        console.error("Del Membership failed:", Apidata.err);
        alert(`Del Membership failed: ${Apidata.err}`);
      }
    } catch (error) {
      console.error("Error occurred during Del Membership:", error);
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal-content dangerModal">
        <button
          type="button"
          className="close-modal"
          onClick={handleModalClose}
        >
          X
        </button>
        <h1>
          Are you sure you wanna Delete Your <br></br>
          <span className="danger">Membership?</span>
        </h1>
        <button
          type="button"
          className="subscribeBtn del"
          onClick={handleModalSubs}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const PauseModal: FC<{
  data: Ship;
  plan: string;
  handleModalClose: (click: any) => void;
}> = ({ data, plan, handleModalClose }) => {
  const handleModalSubs = async () => {
    try {

      const response = await fetch("/api/membership",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "reverse"  }),
          credentials: "same-origin", //only for same-origin requests
        },
      )

      const Apidata = await response.json();

      if (response.ok) {
        console.log("Membership Update successful:", Apidata);
        window.location.href = "/membership";
      } else {
        console.error("Membership Update failed:", Apidata.err);
        alert(`Membership Update failed: ${Apidata.err}`);
      }
    } catch (error) {
      console.error("Error occurred during Membership Update:", error);
    }

  };

  return (
    <div className="modal-overlay">
      <div className="modal-content warnModal">
        <button
          type="button"
          className="close-modal"
          onClick={handleModalClose}
        >
          X
        </button>
        <h1>
          Are you sure you wanna {data.status == "ongoing" ? ("Pause") : ("Resume")} Your <br></br>
          <span className="warn">Membership?</span>
        </h1>
        <button
          type="button"
          className="subscribeBtn war"
          onClick={handleModalSubs}
        >
          {data.status == "ongoing" ? ("Pause") : ("Resume")}
        </button>
      </div>
    </div>
  );
};

const PlanTable: FC<{
  ShipOptions: PlanOptions;
  handleSubscribeClick: (click: any) => void;
}> = ({ ShipOptions, handleSubscribeClick }) => {
  // <div className="overflow-x-auto">
  {
    /* <table className="min-w-full border-collapse border border-gray-300 rounded-full"> */
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300">
      <table className="table-auto w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Plan</th>
            {PlanBenfits.map((option, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">
                {option}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(ShipOptions).map((planStr) => {
            const plan = Number(planStr); // Convert the string key to a number
            return (
              <tr key={plan}>
                <td
                  className="border border-gray-300 px-4 py-2 cursor-pointer btnhh"
                  onClick={() => handleSubscribeClick(plan)}
                >
                  {plan} Days
                </td>
                {PlanBenfits.map((option) => (
                  <td
                    key={option}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {ShipOptions[plan]?.includes(option) ? (
                      <span className="text-green-500">✔</span>
                    ) : (
                      <span className="text-red-500">✘</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default function Home({ data }: { data: Ship }) {
  const [showModal, setShowModal] = useState(false);
  const [showPauseModal, setPauseModal] = useState(false);
  const [showDelModal, setDelModal] = useState(false);
  const [plan, setPlan] = useState("");
  const [ShowPlans, setShowPlans] = useState(false);

  function onSubscribe(plan: string): void {
    setPlan(plan);
    console.log(plan);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setPauseModal(false);
    setDelModal(false);
  }

  function ShowPlansT() {
    setShowPlans(true);
  }

  function ShowPause() {
    setPauseModal(true);
  }

  function ShowDel() {
    setDelModal(true);
  }

  return (
    <div>
      {/* ... (previous JSX remains the same) */}
      <div className="content">
        {data ? (
          <div>
            <h1>Membership<br/>Status</h1>
            <p>Membership Status: {data.status}</p>
            <p>Membership Type: {data.type}</p>
            <p>Started on: {formatDate(data.start)}</p>
            <p>Ends on: {formatDate(data.end)}</p>
            <p>Pauses left: {data.pause_limit}</p>
            {ShowPlans ? (
              <div>
                <br></br>
                <br></br>
                <PlanTable
                  ShipOptions={ShipOptions}
                  handleSubscribeClick={onSubscribe}
                />
              </div>
            ) : (
              <div>
               <div className="button-container">
                <button
                    className="navBtn pauseMembershipBtn"
                    onClick={ShowPause}
                  >
                    <Pause className="btnIcon" size={16} />
                  {data.status == "ongoing" ? ("Pause") : ("Resume")} Membership
                  </button>
                  <button
                    className="navBtn delMembershipBtn"
                    onClick={ShowDel}
                  >
                    <Trash className="btnIcon" size={16} />
                    Delete Membership
                  </button>
                </div>
                <Link href="/dashboard">
                  <button
                    className="subscribeBtn dashboardBtn"
                  >
                    <LayoutDashboard className="btnIcon" size={16} />
                    Dashboard
                  </button>
                </Link>
                <div className="button-container">
                  <Link href="/">
                    <button className="navBtn homeBtn">
                      <House className="btnIcon" size={16} />
                      Home
                    </button>
                  </Link>
                  <button
                    className="navBtn changeMembershipBtn"
                    onClick={ShowPlansT}
                  >
                    <Bolt className="btnIcon" size={16} />
                    Change Membership
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1>You aren't subscribed in any Membership</h1>
            <p>You can subscribe to these available Memberships:</p>
            <br></br>
            <br></br>
            <PlanTable
              ShipOptions={ShipOptions}
              handleSubscribeClick={onSubscribe}
            />
            <div className="button-container">
              <Link href="/">
                <button className="navBtn homeBtn">
                  <House className="btnIcon" size={16} />
                  Home
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
      {showModal && <SubsModal data={data} plan={plan} handleModalClose={closeModal} />}
      {showPauseModal && <PauseModal data={data} plan={plan} handleModalClose={closeModal} />}
      {showDelModal && <DelModal data={data} handleModalClose={closeModal} />}
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
