import AppHeader from "@/app/components/AppHeader";
import BottomNav from "@/app/components/BottomNav";

export default async function Page({ children }) {
  return (
    <>
      <AppHeader />
      {children}
      <BottomNav />
    </>
  );
}
