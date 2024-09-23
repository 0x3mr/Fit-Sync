import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from "@/app/assets/Images/Logo.png";
import Image from "next/image";
import "../../app/globals.css";
import "@/app/assets/styles/login.css";
import Link from "next/link";
import { getShipBySessionId } from "@/app/models/Memberships";
import { getScheduleBySessionId, TrainingSchedule } from "@/app/models/Training";
import { House, LayoutDashboard, Bolt, Trash, Pause,} from "lucide-react";



const TrainingScheduleForm: React.FC = () => {
  const [formData, setFormData] = useState<TrainingSchedule>({
    training_days: [],
    schedule_pattern: "2-train-break-2",
    weekend_type: "fri-sat-sun",
  });

  // Handles input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handles checkbox changes for training and rest days
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, type: "training_days" | "rest_days") => {
    const { value, checked } = e.target;
    const day = parseInt(value);

    setFormData((prevState) => {
      const daysArray = prevState[type] || [];
      return {
        ...prevState,
        [type]: checked ? [...daysArray, day] : daysArray.filter((d) => d !== day),
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "same-origin", // For same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Successful:", data);
        window.location.href = "/";
      } else {
        console.error("Failed:", data.err);
        alert(`Failed: ${data.err}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
    <div className="login-wrapper">
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-heading">Setup</h1>
      <div className="login-input-box">
        <label>Training Days (Select multiple):</label>
        <div style={{ display: "flex", gap: "10px" }}> {/* Flexbox for horizontal alignment */}
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <label key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <input
                type="checkbox"
                value={day}
                checked={formData.training_days.includes(day)}
                onChange={(e) => handleCheckboxChange(e, "training_days")}
              />
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
            </label>
          ))}
        </div>
      </div>

      <div className="login-input-box">
        <label>Schedule Pattern:</label>
        <select name="schedule_pattern" value={formData.schedule_pattern} onChange={handleInputChange}>
          <option value="2-train-break-2">2-train-break-2</option>
          <option value="4-straight-break">4-straight-break</option>
        </select>
      </div>

      <div className="login-input-box">
        <label>Weekend Type:</label>
        <select name="weekend_type" value={formData.weekend_type} onChange={handleInputChange}>
          <option value="fri-sat-sun">Fri-Sat-Sun</option>
          <option value="wed-thu-fri">Wed-Thu-Fri</option>
          <option value="thu-fri-sat">Thu-Fri-Sat</option>
        </select>
      </div>


      <button type="submit" className="login-submit-btn">
            Submit
      </button>
    </form>
          </div>
  </>

  );
};

export default TrainingScheduleForm;
