import adtravelz from "./../../assets/images/adtravelz.png";
import React, { useContext, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import Newsletter from "../../shared/Newsletter";
import { AuthContext } from "../../context/AuthContext";

const Footer = () => {
  const { role } = useContext(AuthContext);

  return (
    <>
      {role === "admin" ? null : (
        <footer className="bg-gray-800 text-white px-5 py-8">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <img
                src={adtravelz}
                alt="Trips Travels adtravelz"
                className="h-20 md:mr-12 "
              />
              <div className="flex flex-col mt-8 text-center md:text-left">
                <p className="mb-2">Address: Chitkara University, Chandigarh,INDIA</p>
                <p className="mb-2">Phone: 6284376084</p>
                <p className="mb-2">Email: adtravelzzz@gmail.com</p>
                <p>&copy; 2024 AdTravelz. All rights reserved.</p>
              </div>
            </div>

            <Newsletter />

            {/* Social Media Links */}
            <div className="flex md:flex-col gap-4 mt-4 md:mt-0">
              <a href="facebook.com" className="text-white hover:text-gray-300">
                <FaFacebookF />
              </a>
              <a href="twitter.com" className="text-white hover:text-gray-300">
                <FaTwitter />
              </a>
              <a href="instagram.com" className="text-white hover:text-gray-300">
                <FaInstagram />
              </a>
              <a href="youtube.com" className="text-white hover:text-gray-300">
                <FaYoutube />
              </a>
              <a href="github.com" className="text-white hover:text-gray-300">
                <FaGithub />
              </a>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
