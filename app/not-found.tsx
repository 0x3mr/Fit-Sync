import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "@/app/globals.css";
import "@/app/assets/styles/404.css";
import Link from "next/link";

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
        <h2><Link href="/"><span style={{ color: "#1aaeff", fontSize: "3.3rem", fontWeight: "700"}}>Go Home</span></Link></h2>
      </div>
    </div>
    </>
  );
}
