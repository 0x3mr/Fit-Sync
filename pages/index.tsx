import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaUser, FaChevronDown, FaSignOutAlt, FaDumbbell, FaFire, FaBolt } from 'react-icons/fa';
import { LuLayoutDashboard } from "react-icons/lu";
import { MdManageAccounts } from "react-icons/md";
import Logo from '@/app/assets/Images/Logo.png';
import GymOverlay from '@/app/assets/Images/Gym-Overlay.png';
import { GetServerSideProps } from 'next';
import { getUserBySessionId } from '../app/models/User';
import '@/app/assets/styles/landing.css';
import '@/app/assets/styles/video.css';

export default function Home({ name }: { name: string }) {
  const isLoggedIn = name !== 'Guest';
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleRegisterRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = '/register';
  };

  const handleSignOut = () => {
    window.location.href = '/logout';
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.playbackRate = 1.5;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="gym-landing">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/Videos/BlackFading.mp4" type="video/mp4" />
      </video>

      <div className="overlay-image-container">
        <Image 
          src={GymOverlay}
          alt="Gym Overlay"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={`logo-container ${isScrolled ? 'scrolled' : ''}`}>
        <Image 
          src={Logo} 
          alt="Logo" 
          priority
        />
      </div>

      <div className='title'>
        <h1>
          KEEP<br/>TURNING<br/>ON THE HEAT
        </h1>
      </div>

      <div className="login-container">
        {name !== 'Guest' ? (
          <div 
            className="welcome-button-container" 
            onMouseEnter={() => setShowDropdown(true)} 
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="welcome-button">
              <FaUser size={24} color="red" />
              <span>{name}</span>
              <FaChevronDown size={24} color="red" />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleDashboard}><LuLayoutDashboard size={20} color="red" className='icon' />  Dashboard</div>
                <div className="dropdown-item"><MdManageAccounts size={20} color="red" className='icon' />  Settings  </div>
                <div className="dropdown-item" onClick={handleSignOut}><FaSignOutAlt size={20} color="red" className='icon' />  Log out</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="login-button" onClick={handleLoginRedirect}>
              Login
              <div className="sign-up" onClick={handleRegisterRedirect}>
                Sign up
              </div>
            </button>
            <span>FIT<br />SYNC</span>
          </>
        )}
      </div>

      <div className="membership-showcase">
        <h2 className="showcase-title">Choose Your Path to Fitness</h2>
        <div className="membership-container">
          <div className="membership-card">
            <div className="membership-image">
              <FaDumbbell size={80} color="#FF3636" />
            </div>
            <h3>Basic Burn</h3>
            <p>Ignite your fitness journey with our entry-level membership.</p>
            <ul>
              <li>Access to main workout area</li>
              <li>Basic equipment usage</li>
              <li>2 group classes per month</li>
            </ul>
            <button className="know-more-btn">Discover More</button>
          </div>
          <div className="membership-card featured">
            <div className="membership-image">
              <FaFire size={80} color="#FF3636" />
            </div>
            <h3>Pro Power</h3>
            <p>Elevate your training with our most popular plan.</p>
            <ul>
              <li>24/7 gym access</li>
              <li>Full equipment access</li>
              <li>Unlimited group classes</li>
              <li>1 personal training session/month</li>
            </ul>
            <button className="know-more-btn">Unleash Pro Power</button>
          </div>
          <div className="membership-card">
            <div className="membership-image">
              <FaBolt size={80} color="#FF3636" />
            </div>
            <h3>Elite Inferno</h3>
            <p>Experience the ultimate fitness journey with VIP perks.</p>
            <ul>
              <li>All Pro Power benefits</li>
              <li>4 personal training sessions/month</li>
              <li>Nutrition consultation</li>
              <li>Exclusive access to Elite events</li>
            </ul>
            <button className="know-more-btn">Join the Elite</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie;
  let name = null;

  if (cookies) {
    const cookie = require('cookie');
    const parsedCookies = cookie.parse(cookies);
    const sessionID = parsedCookies.sessionID;

    if (sessionID) {
      const user = await getUserBySessionId(sessionID);
      if (user.user) name = `${user.user.F_name}`;
    }
  }

  return {
    props: {
      name: name || 'Guest',
    },
  };
};
