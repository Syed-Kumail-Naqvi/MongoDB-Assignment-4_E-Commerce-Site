import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs font-light tracking-wide">
      <p>© {new Date().getFullYear()} E-Store. All Rights Reserved. Powered by Kummi Bro.</p>
    </footer>
  );
};

export default Footer;
