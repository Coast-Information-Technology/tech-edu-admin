import { Svg, Path, Circle } from "@react-pdf/renderer";

// LinkedIn
export const LinkedInIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zm-11 19H5V9h3v10zM6.5 7.7c-1 0-1.8-.8-1.8-1.7s.8-1.8 1.8-1.8c1 0 1.7.8 1.7 1.8s-.7 1.7-1.7 1.7zm12.5 11.3h-3v-5.2c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V19h-3V9h2.8v1.4h.1c.4-.8 1.5-1.7 3-1.7 3.2 0 3.8 2.1 3.8 4.8V19z"
    />
  </Svg>
);

// GitHub
export const GitHubIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.7-.3-5.5-1.3-5.5-6a4.6 4.6 0 0 1 1.2-3.2 4.2 4.2 0 0 1 .1-3.2s1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2a4.2 4.2 0 0 1 .1 3.2 4.6 4.6 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
    />
  </Svg>
);

// Twitter / X
export const TwitterIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M23 3a10.9 10.9 0 0 1-3.1.9 5.4 5.4 0 0 0 2.4-3 10.9 10.9 0 0 1-3.4 1.3 5.4 5.4 0 0 0-9.3 4.9A15.3 15.3 0 0 1 1.7 2a5.3 5.3 0 0 0 1.7 7.2 5.3 5.3 0 0 1-2.4-.7v.1a5.4 5.4 0 0 0 4.3 5.3 5.4 5.4 0 0 1-2.4.1 5.4 5.4 0 0 0 5 3.7A10.9 10.9 0 0 1 1 19.5 15.3 15.3 0 0 0 9.3 22c11.1 0 17.2-9.2 17.2-17.2v-.8A12.2 12.2 0 0 0 23 3z"
    />
  </Svg>
);

// Envelope (Mail)
export const MailIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
    />
  </Svg>
);

// Phone
export const PhoneIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3 11.7 11.7 0 0 0 3.7.6 1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.7.1.3 0 .7-.3 1l-2.2 2.1z"
    />
  </Svg>
);

// Instagram
export const InstagramIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.6 0 3 1.4 3 3v10c0 1.6-1.4 3-3 3H7c-1.6 0-3-1.4-3-3V7c0-1.6 1.4-3 3-3h10zm-5 3.5A5.5 5.5 0 1 0 17.5 13 5.5 5.5 0 0 0 12 7.5zm0 9A3.5 3.5 0 1 1 15.5 13 3.5 3.5 0 0 1 12 16.5zM18 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
    />
  </Svg>
);

// Globe (WWW)
export const GlobeIcon = ({ size = 48 }) => (
  <Svg viewBox="0 0 48 48" width={size} height={size}>
    <Path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm7.9 9h-2.1a15.3 15.3 0 0 0-1.2-5 8 8 0 0 1 3.3 5zM12 4a13.2 13.2 0 0 1 1.8 7h-3.6A13.2 13.2 0 0 1 12 4zm-4.6.9a15.3 15.3 0 0 0-1.2 6.1H4.1a8 8 0 0 1 3.3-6.1zM4.1 13h2.1a15.3 15.3 0 0 0 1.2 5.1 8 8 0 0 1-3.3-5.1zm7.9 7a13.2 13.2 0 0 1-1.8-7h3.6a13.2 13.2 0 0 1-1.8 7zm4.6-.9a15.3 15.3 0 0 0 1.2-6.1h2.1a8 8 0 0 1-3.3 6.1z"
    />
  </Svg>
);
