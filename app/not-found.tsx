import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "@/app/globals.css";
import "@/app/assets/styles/404.css";

export default function NotFound() {
  return (
    <>
<div className="containerr">
      <div className="hh1">
        <h1>404</h1>
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
        <h2>Looks like you got lost</h2>
        <h2>(skill issue)</h2>
      </div>
    </div>
      <a href="#" className="login-back-button">
        <FaArrowLeft className="back-icon" />
        Back
      </a>
    </>
  );
}
