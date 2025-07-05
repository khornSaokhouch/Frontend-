// File: app/layout.jsx
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Your Site",
  description: "Best booking site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
