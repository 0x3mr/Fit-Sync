import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import "@/app/globals.css";
import "@/app/assets/styles/404.css";
import Link from "next/link";

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
        <h2>Looks like you not Authorized to view <br></br>this page please <Link href="/login"><span style={{ color: "#1aaeff", fontSize: "3.3rem", fontWeight: "700"}}>login</span></Link>.</h2>
        <h2>(skill issue too)</h2>
      </div>
    </div>
    </>
  );
}
