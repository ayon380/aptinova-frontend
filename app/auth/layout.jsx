import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
export default function Home({ children }) {
  return (
    <div className="text-xl">
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
