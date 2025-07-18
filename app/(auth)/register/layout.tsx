import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register – Tech Edu Solution",
  description:
    "Create your free Tech Edu Solution account. Register to access CV Builder, scholarship tools, training, job search, and employer features—all in one place.",
  keywords:
    "register, sign up, tech edu registration, create account, student registration, employer registration, join tech edu",
  openGraph: {
    title: "Register – Tech Edu Solution",
    description:
      "Create your free Tech Edu Solution account. Register to access CV Builder, scholarship tools, training, job search, and employer features—all in one place.",
    url: "https://techedusolution.com/register",
    siteName: "Tech Edu Solution",
    images: [
      {
        url: "/assets/authImage.webp",
        width: 1200,
        height: 630,
        alt: "Register at Tech Edu Solution",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register – Tech Edu Solution",
    description:
      "Create your free Tech Edu Solution account. Register to access CV Builder, scholarship tools, training, job search, and employer features—all in one place.",
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
    canonical: "https://techedusolution.com/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
