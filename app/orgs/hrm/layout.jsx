import AppHeader from "@/app/components/AppHeader";
import BottomNav from "@/app/components/BottomNav";

export default async function Page({ children }) {
  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden w-full">
        <BottomNav />
        <div className="flex-1  overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
