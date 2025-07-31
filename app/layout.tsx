import { Metadata } from "next";
import { Rubik, Poppins } from "next/font/google";
import "./globals.css";
// import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import { RoleProvider } from "@/contexts/RoleContext";
import { CartProvider } from "@/contexts/CartContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ProductProvider } from "@/contexts/ProductContext";
import CookieConsent from "@/components/CookieConsent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import InternetCheck from "@/utils/internetCheck";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  preload: true,
});

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700", "800", "900"],
//   style: ["normal"],
//   preload: true,
// });

// export const metadata: Metadata = {
//   metadataBase: new URL("https://techedusolution.com"),
//   title: "Tech Edu Solution Limited - Empowering Education & Career Growth",
//   description:
//     "Transform your academic and professional journey with Tech Edu Solution Limited. Access personalized mentorship, scholarship guidance, CV building tools, and data-driven career development solutions.",
//   keywords: [
//     "education technology",
//     "career development",
//     "scholarship guidance",
//     "academic mentorship",
//     "professional training",
//     "CV builder",
//     "career growth",
//     "graduate hiring",
//     "training consultants",
//     "CareerConnect",
//   ],
//   openGraph: {
//     title: "Tech Edu Solution Limited - Empowering Education & Career Growth",
//     description:
//       "Transform your academic and professional journey with Tech Edu Solution Limited. Access personalized mentorship, scholarship guidance, CV building tools, and data-driven career development solutions.",
//     type: "website",
//     locale: "en_US",
//     siteName: "Tech Edu Solution Limited",
//     url: "https://techedusolution.com",
//     images: [
//       {
//         url: "/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Tech Edu Solution Limited",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Tech Edu Solution Limited - Empowering Education & Career Growth",
//     description:
//       "Transform your academic and professional journey with Tech Edu Solution Limited. Access personalized mentorship, scholarship guidance, CV building tools, and data-driven career development solutions.",
//     images: ["/og-image.jpg"],
//     creator: "@techedusolution",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   alternates: {
//     canonical: "https://techedusolution.com",
//   },
//   verification: {
//     google: "your-google-site-verification",
//     yandex: "your-yandex-verification",
//   },
//   authors: [{ name: "Tech Edu Solution Limited" }],
//   creator: "Tech Edu Solution Limited",
//   publisher: "Tech Edu Solution Limited",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   category: "Education Technology",
//   classification: "Business",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${rubik.className} antialiased`}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <RoleProvider>
          <CartProvider>
            <CookieConsentProvider>
              <ProfileProvider>
                <ProductProvider>
                  {/* <Header /> */}
                  {children}
                  {/* <Footer /> */}
                  <CookieConsent />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </ProductProvider>
              </ProfileProvider>
            </CookieConsentProvider>
            <InternetCheck />
          </CartProvider>
        </RoleProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
