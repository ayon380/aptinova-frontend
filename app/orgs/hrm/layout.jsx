import AppHeader from "@/app/components/AppHeader";
import BottomNav from "@/app/components/BottomNav";

export default async function Page({ children }) {
  return (
    <div className="h-dvh w-screen overflow-hidden">
      <AppHeader />
      <div className="flex  h-full w-full">
        <BottomNav />
        {children}
      </div>
    </div>
  );
}
