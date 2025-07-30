import React from "react";
import { MapPin, Phone } from "lucide-react";

function NavBar() {
  return (
    <nav className="bg-gradient-to-r from-white via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-start space-x-4">
        {/* Logo */}
        <img
          src="https://res.cloudinary.com/dv06id9q6/image/upload/v1753682515/20250718_231358_efatuf.webp"
          alt="Logo"
          className="w-16 h-16 object-cover"
        />

        {/* Text */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-xl font-bold font-poppins text-gray-800 dark:text-white tracking-wide">
            GodFather Dog Kennel
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4" />
            <a href="tel:+919991485780">+91 99914 85780</a>
          </div>
          <a
            href="https://maps.google.com/?q=GodFather+Kennel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            <MapPin className="w-4 h-4" />
            <span>View on Google Maps</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
