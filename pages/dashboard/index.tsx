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
import MultiDateCalendar, { HighlightedDay } from "@/app/components/Calender";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GetServerSideProps } from "next";
import { getShipBySessionId, Ship, hasAccess} from "@/app/models/Memberships";
import { getUserCalendarBySessionId, TrainingPlanType } from "@/app/models/User";
import Link from "next/link";

export default function Dashboard({ data, plan, calenD, today}: { data: Ship, plan: string[], calenD: HighlightedDay[], today: TrainingPlanType}) {
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
      <Link href="/" passHref>
        <Image
         src={Logo}
         alt="Logo"
         width={225} height={75} priority
        />
      </Link>
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
                    key={option as string}
                    className={selectedOption === option ? "active" : ""}
                    onClick={() => setSelectedOption(option as string)}
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
                 <MultiDateCalendar highlightedDays={calenD} />
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
                {selectedOption === "Training Plan" && <TrainingPlan plan={today}/>}
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
  let calenD = null;
  let today = null;

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
      const {err, schedule} = await getUserCalendarBySessionId(sessionID);
      if (!err && Array.isArray(schedule?.schedule)) {
        const tday = new Date();
        const tdayf = tday.getFullYear() + '-' 
            + String(tday.getMonth() + 1).padStart(2, '0') + '-' 
            + String(tday.getDate()).padStart(2, '0');
        calenD = {
          schedule: schedule.schedule.map(entry => {
            const isoDate = entry.date.toISOString(); // Convert Date to ISO string
            if (isoDate.split('T')[0] === tdayf) {
              console.log(isoDate.split('T')[0] === new Date().toISOString().split('T')[0], isoDate.split('T')[0], new Date().toISOString().split('T')[0]);
              today = {
                ...entry,
                date: isoDate,
              }; // Save if it matches today's date
            }
            return {
              ...entry,
              date: isoDate,
            };
          }),
        };
        
        calenD = calenD.schedule;
        // console.log(calenD);
      }
      else{
        return {
          redirect: {
            destination: '/setup',
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
      calenD: calenD, 
      today: today
    },
  };
};

