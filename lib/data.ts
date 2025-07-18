// data/sidebar.ts

import { INavLink } from "@/lib/types";
import { ICountry } from "./types";

export const impactCountries: ICountry[] = [
  {
    code: "NGA",
    alpha2Code: "NG",
    name: "UK",
    coordinates: [8.6753, 9.082],
    intensity: 100,
  },
  {
    code: "USA",
    alpha2Code: "US",
    name: "United States",
    coordinates: [-95.7129, 37.0902],
    intensity: 80,
  },
  {
    code: "GBR",
    alpha2Code: "GB",
    name: "United Kingdom",
    coordinates: [-3.435973, 55.378051],
    intensity: 60,
  },
  {
    code: "IND",
    alpha2Code: "IN",
    name: "India",
    coordinates: [78.9629, 20.5937],
    intensity: 40,
  },
  {
    code: "BRA",
    alpha2Code: "BR",
    name: "Brazil",
    coordinates: [-51.9253, -14.235],
    intensity: 30,
  },
  {
    code: "KEN",
    alpha2Code: "KE",
    name: "Kenya",
    coordinates: [37.9062, -0.0236],
    intensity: 55,
  },
  {
    code: "DEU",
    alpha2Code: "DE",
    name: "Germany",
    coordinates: [10.4515, 51.1657],
    intensity: 50,
  },
  {
    code: "CAN",
    alpha2Code: "CA",
    name: "Canada",
    coordinates: [-106.3468, 56.1304],
    intensity: 45,
  },
  {
    code: "AUS",
    alpha2Code: "AU",
    name: "Australia",
    coordinates: [133.7751, -25.2744],
    intensity: 35,
  },
  {
    code: "ZAF",
    alpha2Code: "ZA",
    name: "South Africa",
    coordinates: [22.9375, -30.5595],
    intensity: 65,
  },
  {
    code: "FRA",
    alpha2Code: "FR",
    name: "France",
    coordinates: [2.2137, 46.2276],
    intensity: 42,
  },
  {
    code: "SGP",
    alpha2Code: "SG",
    name: "Singapore",
    coordinates: [103.8198, 1.3521],
    intensity: 38,
  },
  {
    code: "EGY",
    alpha2Code: "EG",
    name: "Egypt",
    coordinates: [30.8025, 26.8206],
    intensity: 48,
  },
  {
    code: "SAU",
    alpha2Code: "SA",
    name: "Saudi Arabia",
    coordinates: [45.0792, 23.8859],
    intensity: 52,
  },
  {
    code: "JPN",
    alpha2Code: "JP",
    name: "Japan",
    coordinates: [138.2529, 36.2048],
    intensity: 58,
  },
];

// lib/data.ts

export const INavLinks: INavLink[] = [
  { href: "/", label: "Home" },
  {
    label: "Company",
    subLinks: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    label: "Services",
    subLinks: [
      { href: "/academic-services", label: "Academic Services" },
      { href: "/corporate-consultancy", label: "Corporate Consultancy" },
      { href: "/career-development", label: "Career Development" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  {
    label: "CareerConnect",
    href: "/career-connect",
    subLinks: [
      { href: "/career-connect/employers", label: "For Employers" },
      // { href: "/career-connect/graduates", label: "For Graduates" },
      { href: "/career-connect/talents", label: "Browse Talent" },
      { href: "/career-connect/post-job", label: "Post a Job" },
    ],
  },
  {
    href: "/training",
    label: "Training",
    subLinks: [
      { href: "/training/individual", label: "Individual" },
      { href: "/training/teams", label: "Teams" },
      { href: "/training/catalog", label: "Catalog" },
      { href: "/training/certifications", label: "Certification Info" },
    ],
  },
  {
    label: "Tools",
    subLinks: [
      { href: "/tools/cv-builder", label: "CV Builder" },
      { href: "/tools/scholarship-coach", label: "Scholarship Coach" },
      { href: "/tools/package-estimator", label: "Package Estimator" },
    ],
  },
  // { href: "/auth/login", label: "Login" },
];
