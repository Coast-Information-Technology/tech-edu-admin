import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login – Tech Edu Solution",
  description:
    "Login to your Tech Edu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
  keywords:
    "tech edu login, cv builder login, resume portal sign in, student dashboard login",
  openGraph: {
    title: "Login – Tech Edu Solution",
    description:
      "Login to your Tech Edu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
    url: "https://techedusolution.com/login",
    siteName: "Tech Edu Solution",
    images: [
      {
        url: "/assets/authImage.webp",
        width: 1200,
        height: 630,
        alt: "Tech Edu Solution Login Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login – Tech Edu Solution",
    description:
      "Login to your Tech Edu Solution account to access CV Builder, scholarship tools, training records, and personalized support.",
    images: ["/assets/authImage.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://techedusolution.com/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
