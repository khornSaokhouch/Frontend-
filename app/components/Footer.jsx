export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-8">
      <p>© {new Date().getFullYear()} Service Booker. All rights reserved.</p>
    </footer>
  );
}