"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          ISP<span className="text-primary">media</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/media" className="hover:text-primary">
            Explorar
          </Link>
          <Link href="/login" className="hover:text-primary">
            Entrar
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FDC500] text-black px-6 py-2 rounded-full font-medium"
          >
            Upload
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
