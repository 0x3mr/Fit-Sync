import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { FaUser, FaLock } from "react-icons/fa";
import Image from "next/image";
import Logo from "@/app/assets/Images/Logo.png"; // Replace with actual logo path

// Styles for login and register modals
const loginStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const registerStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600, // Register modal is larger
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function LoginRegisterModal() {
  const [open, setOpen] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(true); // Toggle between login and register
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [weight, setWeight] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleLoginRegister = () => setIsLogin(!isLogin);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login:", { email, password });
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          F_name: firstName,
          L_name: lastName,
          weight,
          height,
          age,
        }),
        // credentials: 'include', // Include credentials to save cookies, only in cross-origin requests
        credentials: "same-origin", //only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Register successful:", data);
        window.location.href = "/login";
      } else {
        console.error("Register failed:", data.err);
        alert(`Register failed: ${data.err}`);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }

    console.log("Register:", {
      email,
      password,
      firstName,
      lastName,
      age,
      height,
      weight,
    });
  };

  return (
    <div>
      {/* Single button to open modal */}
      <Button onClick={handleOpen}>Login</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-login-register-title"
        aria-describedby="modal-login-register-description"
      >
        <Box sx={isLogin ? loginStyle : registerStyle}>
          <Image
            src={Logo}
            alt="Logo"
            className="logo w-[60%] mt-5 mb-4 md:w-full"
          />

          {isLogin ? (
            // Login Form
            <>
              <Typography
                id="modal-login-register-title"
                variant="h6"
                component="h2"
              >
                Login
              </Typography>
              <form onSubmit={handleSubmitLogin}>
                <div className="input-box">
                  <TextField
                    id="login-email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaUser className="icon" />
                </div>
                <div className="input-box">
                  <TextField
                    id="login-password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaLock className="icon" />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Login
                </Button>
              </form>
              <Typography sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href="#" onClick={toggleLoginRegister}>
                  Register
                </Link>
              </Typography>
            </>
          ) : (
            // Register Form
            <>
              <Typography
                id="modal-login-register-title"
                variant="h6"
                component="h2"
              >
                Register
              </Typography>
              <form onSubmit={handleSubmitRegister}>
                <div className="input-box">
                  <TextField
                    id="register-firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaUser className="icon" />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-lastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaUser className="icon" />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-age"
                    label="Age"
                    variant="outlined"
                    fullWidth
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-height"
                    label="Height (cm)"
                    variant="outlined"
                    fullWidth
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-weight"
                    label="Weight (kg)"
                    variant="outlined"
                    fullWidth
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaUser className="icon" />
                </div>
                <div className="input-box">
                  <TextField
                    id="register-password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <FaLock className="icon" />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Register
                </Button>
              </form>
              <Typography sx={{ mt: 2 }}>
                Already have an account?{" "}
                <Link href="#" onClick={toggleLoginRegister}>
                  Login
                </Link>
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
