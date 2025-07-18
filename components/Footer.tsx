"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { disableHeaderWithFooter } from "@/utils/disableHeaderWithFooter";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const shouldHideHeader = disableHeaderWithFooter.some((path) => {
    const pattern = path.replace(/\[.*\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  });

  if (shouldHideHeader) return null;

  return (
    <footer
      className="bg-[#011F72] text-gray-200"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="max-w-6xl mx-auto px-4 py-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo + Content */}
        <div className="col-span-1 lg:col-span-2">
          <Image
            src="/assets/techedusolution.jpg"
            alt="EduTech logo"
            width={120}
            height={120}
            className="rounded-[5px]"
          />
          <p className="text-md text-gray-200 max-w-[90%] mt-4 font-light">
            Empowering your journey from education to career success. We provide
            expert guidance in scholarships, professional development, and
            strategic career planning to help you achieve your goals with
            confidence.
          </p>
        </div>

        {/* Company */}
        <nav aria-label="Company Navigation">
          <h4 className="font-semibold mb-8 text-[1.5rem] text-white">
            Company
          </h4>
          <ul
            role="list"
            className="space-y-2 text-[1rem] text-blue-300 font-light"
          >
            <li role="listitem">
              <Link
                href="/about"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                About Us
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/contact"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Contact
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/contact#discovery-call"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Book Consultation
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/pricing"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Pricing
              </Link>
            </li>
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label="Services Navigation">
          <h4 className="font-semibold mb-8 text-[1.5rem] text-white">
            Services
          </h4>
          <ul
            role="list"
            className="space-y-2 text-[1rem] text-blue-300 font-light"
          >
            <li role="listitem">
              <Link
                href="/academic-services"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Academic Services
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/career-developement"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Career Developement
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/corporate-consultancy"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Corporate Consultancy
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/career-connect"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                CareerConnect
              </Link>
            </li>
          </ul>
        </nav>

        {/* Tools */}
        <nav aria-label="Tools Navigation">
          <h4 className="font-semibold mb-8 text-[1.5rem] text-white">Tools</h4>
          <ul
            role="list"
            className="space-y-2 text-[1rem] text-blue-300 font-light"
          >
            <li role="listitem">
              <Link
                href="/tools/cv-builder"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                CV Builder
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/tools/scholarship-coach"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Scholarship Coach
              </Link>
            </li>
            <li role="listitem">
              <Link
                href="/tools/package-estimator/start#estimator-wizard-steps"
                className="hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Estimator
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-6 bg-black">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-[12px] gap-4">
          <p className="text-[12px] font-light">
            © Tech Edu Solution, 2025. All rights reserved.
          </p>

          <nav aria-label="Legal Links" className="flex gap-4 font-light">
            <Link
              href="/terms-conditions"
              className="hover:text-white hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-white hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white border-l-2 border-gray-200 pl-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-white hover:underline focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white border-l-2 border-gray-200 pl-4"
            >
              FAQs
            </Link>
          </nav>

          <nav aria-label="Social Media" className="flex gap-3 ml-4">
            <Link
              href="#"
              aria-label="LinkedIn"
              className="hover:text-blue-300 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <FaLinkedin size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="hover:text-pink-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-pink-500"
            >
              <FaInstagram size={18} />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="hover:text-blue-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <FaFacebookSquare size={18} />
            </Link>
            <Link
              href="#"
              aria-label="X (formerly Twitter)"
              className="hover:text-gray-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <FaXTwitter size={18} />
            </Link>
            <Link
              href="#"
              aria-label="YouTube"
              className="hover:text-red-600 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <FaYoutube size={18} />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
