import React, { useState } from 'react';
import Image from "next/image";
import { FaUser, FaLock, FaBell, FaLanguage, FaPalette, FaQuestionCircle, FaLinkedin, FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { MdCardMembership } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import Logo from "@/app/assets/Images/Logo.png";
import auth1 from "@/app/assets/Images/Madiocre.png";
import auth2 from "@/app/assets/Images/Justxd.png";
import auth3 from "@/app/assets/Images/0x3mr.png";
import GymOverlay from "@/app/assets/Images/Gym-Overlay.png";
import '@/app/assets/styles/settings.css';

export default function SettingsPage({ name }: { name: string }) {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="settings-form">
            <h2>Account Settings</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="your.email@example.com" />
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case 'security':
        return (
          <div className="settings-form">
            <h2>Security Settings</h2>
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input type="password" id="current-password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input type="password" id="new-password" placeholder="••••••••" />
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-form">
            <h2>Notification Settings</h2>
            <div className="form-group checkbox">
              <input type="checkbox" id="email-notif" />
              <label htmlFor="email-notif">Email Notifications</label>
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" id="push-notif" />
              <label htmlFor="push-notif">Push Notifications</label>
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case 'help':
        return (  
          <div className="help-support">
            <h2>Help & Support</h2>
            <p className="help-description">Project is m  aintained by these three authors, feel free to reach out to them for any assistance or support.</p>
            <h3>Project Authors</h3>
            <div className="authors-list">
              <div className="author-card">
                <div className="author-avatar">
                  <Image src={auth2} alt="Noor Amjad" width={60} height={60} />
                </div>
                <h4>Noor Amjad</h4>
                <div className="author-socials">
                  <a href="https://www.linkedin.com/in/noor-amjad-xd" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href="https://github.com/Justxd22" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
              </div>
              <div className="author-card">
                <div className="author-avatar">
                  <Image src={auth1} alt="Ahmed Shalaby" width={60} height={60} />
                </div>
                <h4>Ahmed Shalaby</h4>
                <div className="author-socials">
                  <a href="https://www.linkedin.com/in/ahmed-shalaby-31a03a235/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href="https://github.com/Madiocre" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
              </div>
              <div className="author-card">
                <div className="author-avatar">
                  <Image src={auth3} alt="Amr Abdelfattah" width={60} height={60} />
                </div>
                <h4>Amr Abdelfattah</h4>
                <div className="author-socials">
                  <a href="https://www.linkedin.com/in/amrabdelfattah/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                  <a href="https://github.com/0x3mr" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab to view settings</div>;
    }
  };

  return (
    <div>
      <a href="/dashboard" className="dashboard-icon">
        <LuLayoutDashboard />
      </a>
      <div className="settings-page">
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

        <div className='logo-container'>
          <Image 
            src={Logo} 
            alt="Logo" 
            priority
          />
        </div>

        <main className="settings-content">
          <aside className="settings-sidebar">
            <h2 className="sidebar-title">SETTINGS</h2>
            <nav>
              <button
                className={activeTab === 'account' ? 'active' : ''}
                onClick={() => setActiveTab('account')}
              >
                <FaUser /> Account
              </button>
              <button
                className={activeTab === 'security' ? 'active' : ''}
                onClick={() => setActiveTab('security')}
              >
                <FaLock /> Security
              </button>
              <button
                onClick={() => window.location.href = '/membership'}
              >
                <MdCardMembership /> Memberships <FiExternalLink />
              </button>
              {/* <button
                className={activeTab === 'notifications' ? 'active' : ''}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell /> Notifications
              </button> */}
              <button className="disabled">
                <FaBell /> Notifications
              </button>
              <button className="disabled">
                <FaLanguage /> Language
              </button>
              <button className="disabled">
                <FaPalette /> Appearance
              </button>
              <button
                className={activeTab === 'help' ? 'active' : ''}
                onClick={() => setActiveTab('help')}
              >
                <FaQuestionCircle /> Help & Support
              </button>
            </nav>
          </aside>

          <section className="settings-main">
            {renderTabContent()}
          </section>
        </main>
      </div>
    </div>
  );
};