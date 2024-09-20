import { useEffect, useState } from "react";
import Image from "next/image";
import TrainingPlan from "./TrainingPlan";
import DietPlan from "./DietPlan";
import {
  FaCalendarAlt,
  FaComments,
  FaQuoteLeft,
  FaUtensils,
  FaCrown,
  FaClock,
  FaDumbbell,
} from "react-icons/fa";
import Logo from "@/app/assets/Images/Logo.png";
import GymOverlay from "@/app/assets/Images/Gym-Overlay.png";
import "@/app/assets/styles/dashboard.css";
import "@/app/assets/styles/video.css";
import MultiDateCalendar from "@/app/components/Calender";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GetServerSideProps } from "next";
import { getShipBySessionId, Ship, hasAccess} from "@/app/models/Memberships";
import Link from "next/link";

export default function Dashboard({ data, plan }: { data: Ship, plan: string[] }) {
  const [selectedOption, setSelectedOption] = useState("Calendar");
  const [isScrolled, setIsScrolled] = useState(false);
  const daysRemaining = data.days_left;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  {
    /* <header className="dashboard-header">
        <Image src={Logo} alt="Logo" width={150} height={75} priority />
      </header> */
  }
  return (
    <div className="dashboard">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/Videos/BlackFading.mp4" type="video/mp4" />
      </video>

      <div className="overlay-image-container">
        <Image
          src={GymOverlay}
          alt="Gym Overlay"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <header className="dashboard-header">
        <Image src={Logo} alt="Logo" width={225} height={75} priority />
      </header>

      <div className="dashboard-content">
        <section className="pad-4">
          <aside className="sidebar">
            <h2 className="sidebar-title">MANAGE</h2>
            <nav>
              {[
                // "Calendar",
                // "Motivation Quotes",
                "Training Plan",
                plan.includes("Boxing access") && "Boxing Days", //premuim
                plan.includes("Coach Followup") && "Coach Followup", //premuim
                plan.includes("Live Coach Access") && "Contact Coach", //premuim
                plan.includes("Diet program") && "Diet Plan",
              ].filter(Boolean)
              .map((option) => (
                <button
                  key={option}
                  className={selectedOption === option ? "active" : ""}
                  onClick={() => setSelectedOption(option)}
                >
                  {/* {option === "Calendar" && <FaCalendarAlt />} */}
                  {/* {option === "Motivation Quotes" && <FaQuoteLeft />} */}
                  {option === "Training Plan" && <FaDumbbell />}
                  {option === "Contact Coach" &&  <FaComments />}
                  {option === "Coach Followup" && <FaComments />}
                  {option === "Boxing Days" && <FaComments />}
                  {option === "Diet Plan" && <FaUtensils />}
                  {option}
                </button>
              ))}
            </nav>
          </aside>

          <div className="calendar-container">
            {/* Wrap MultiDateCalendar in LocalizationProvider */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MultiDateCalendar />
            </LocalizationProvider>
          </div>
        </section>
        <main className="main-content">
        <Link href="/membership" passHref>
  <div className="membership-info" style={{ cursor: "pointer", textDecoration: "none", color: "white" }}>
    <FaCrown /> <span>Pro Membership</span> |{" "}
    <span>{daysRemaining} days remaining</span> <FaClock />
  </div>
</Link>

          <div className="content-area">
            <div className="training-program">
              <div className="program-content">
                {selectedOption === "Training Plan" && <TrainingPlan />}
                {selectedOption === "Diet Plan" && <DietPlan />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie;
  let data = null;
  let plan = null;

  if (cookies) {
    const cookie = require("cookie"); // Use the cookie package to parse cookies
    const parsedCookies = cookie.parse(cookies);
    const sessionID = parsedCookies.sessionID;

    if (sessionID) {
      const user = await getShipBySessionId(sessionID);
      if (!user.err) {
        data = user.ship;
        plan = hasAccess(user.ship?.type)
      }
      else{
        return {
          redirect: {
            destination: '/membership',
            permanent: false,
          },
        };    
      }
    }
  }

  return {
    props: {
      data: data || null,
      plan: plan,
    },
  };
};

