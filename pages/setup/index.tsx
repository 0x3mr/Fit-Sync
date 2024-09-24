import { GetServerSideProps } from "next";
import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from "@/app/assets/Images/Logo.png";
import Image from "next/image";
import "../../app/globals.css";
import "@/app/assets/styles/login.css";
import Link from "next/link";
import { getShipBySessionId } from "@/app/models/Memberships";
import { House, LayoutDashboard, Bolt, Trash, Pause,} from "lucide-react";



const TrainingScheduleForm: React.FC = () => {
  const [formData, setFormData] = useState<{ training_days: number[] }>({
    training_days: [],
  });

  // Handles checkbox changes for training and rest days
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "training_days"
  ) => {
    const { value, checked } = e.target;
    const day = parseInt(value);

    setFormData((prevState) => {
      const daysArray = prevState[type] || [];
      const updatedDays = checked
        ? [...daysArray, day]
        : daysArray.filter((d) => d !== day);
      return {
        ...prevState,
        [type]: updatedDays,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the number of selected days is between 3 and 5
    if (formData.training_days.length < 3 || formData.training_days.length > 5) {
      alert("Please select between 3 and 5 training days.");
      return;
    }

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "same-origin",
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
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-heading">Setup</h1>
        <div className="login-input-box">
          <label>Select your Training Days (3 atleast):</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <label
                key={day}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  value={day}
                  checked={formData.training_days.includes(day)}
                  onChange={(e) => handleCheckboxChange(e, "training_days")}
                  disabled={
                    !formData.training_days.includes(day) &&
                    formData.training_days.length >= 5
                  }
                />
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
              </label>
            ))}
          </div>
        </div>
        <button 
        type="submit"
        className="login-submit-btn"
        disabled={formData.training_days.length < 3}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default TrainingScheduleForm;
