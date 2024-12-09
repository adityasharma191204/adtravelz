import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import RegisterImg from "../assets/images/Signup2.png";
import BASE_URL from "../utils/config";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    role: "user",
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    // Username validation
    if (!/^(?=.*[a-zA-Z]).{3,}$/.test(username)) {
      toast.error(
        "Username must contain at least 3 alphabetic characters and can include numbers or special characters."
      );
      return false;
    }

    // Email validation
    const emailRegex = /^[\w-\.]+@(gmail\.com|hotmail\.com|yahoo\.com|edu\.in|chitkara\.edu\.in)$/;
    if (!emailRegex.test(email)) {
      toast.error(
        "Email must be from gmail, hotmail, yahoo, edu.in, or chitkara.edu.in domains."
      );
      return false;
    }

    // Password match validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await response.json();
      setIsLoading(false);

      if (response.ok) {
        toast.success(message);
        navigate("/login");
      } else {
        toast.error(message);
      }
    } catch (err) {
      setIsLoading(false);
      toast.error("User already Exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
        {/* Sign Up Photo */}
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <img
            src={RegisterImg}
            alt="Trips Travels Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sign Up Form */}
        <div className="flex flex-col justify-center p-6 md:p-12 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Register
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Create your account to start your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                value={formData.username}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                value={formData.email}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.password}
                  onChange={handleInput}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={formData.confirmPassword}
                  onChange={handleInput}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
