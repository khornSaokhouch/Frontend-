import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function UserLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
