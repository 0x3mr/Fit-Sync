import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaComments,
  FaQuoteLeft,
  FaUtensils,
  FaCrown,
  FaClock,
} from "react-icons/fa";
import Logo from "@/app/assets/Images/Logo.png";
import GymOverlay from "@/app/assets/Images/Gym-Overlay.png";
import "@/app/assets/styles/dashboard.css";
import "@/app/assets/styles/video.css";
import MultiDateCalendar from "@/app/components/Calender";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Dashboard({ name }: { name: string }) {
  const [selectedOption, setSelectedOption] = useState("Calendar");
  const [isScrolled, setIsScrolled] = useState(false);
  const daysRemaining = 1204;

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
                "Contact Coach",
                "Motivation Quotes",
                "Diet Plan",
              ].map((option) => (
                <button
                  key={option}
                  className={selectedOption === option ? "active" : ""}
                  onClick={() => setSelectedOption(option)}
                >
                  {/* {option === "Calendar" && <FaCalendarAlt />} */}
                  {option === "Contact Coach" && <FaComments />}
                  {option === "Motivation Quotes" && <FaQuoteLeft />}
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
          <div className="membership-info">
            <FaCrown /> <span>Pro Membership</span> |{" "}
            <span>{daysRemaining} days remaining</span> <FaClock />
          </div>

          <div className="content-area">
            <div className="training-program">
              <h2>Today's Training Program</h2>
              <div className="program-content"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
