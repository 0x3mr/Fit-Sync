import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import "@/app/globals.css";
import "@/app/assets/styles/404.css";

export default function Custom401() {
  return (
    <>
<div className="containerr">
      <div className="hh1">
        <h1>401</h1>
      </div>
    <div className="eyes">
      <div className="eye">
        <div className="eye__pupil eye__pupil--left"></div>
      </div>
      <div className="eye">
        <div className="eye__pupil eye__pupil--right"></div>
      </div>
    </div>
    <br></br>
    <br></br>
    <br></br>
    <div className="hh1">
        <h2>Looks like you not Authorized to view <br></br>this page please login.</h2>
        <h2>(skill issue too)</h2>
      </div>
    </div>
      <a href="#" className="login-back-button">
        <FaArrowLeft className="back-icon" />
        Back
      </a>
    </>
  );
}
