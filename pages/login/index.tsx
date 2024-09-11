// app/pages/users/index.tsx
import React, { FC, useState, useEffect } from "react";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import Logo from '@/app/assets/Images/Logo.png';
import Image from 'next/image';
import '../../app/globals.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        async function isValid() {
            const res = await fetch('/api/session', { credentials: 'same-origin' });
            const data = await res.json();
            console.log(data);
            if (data.code === 0) {
                window.location.href = '/';
            }
        }
        isValid();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                // credentials: 'include', // Include credentials to save cookies, only in cross-origin requests
                credentials: 'same-origin', //only for same-origin requests
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                window.location.href = '/';
            } else {
                console.error('Login failed:', data.message);
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error occurred during login:', error);
        }
    };
    return (
        <>
            <Image
                src={Logo}
                alt="Logo"
                className="logo w-[60%] mt-20 md:mt-0 md:w-full"
            />
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className="icon" />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </form>
            </div>

            <a href="#" className="back-button">
                <FaArrowLeft className="icon" />
                Back
            </a>
        </>
    );
}