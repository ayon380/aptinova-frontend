import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";

export default async function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden w-full">
        <BottomNav />
        <div className="flex-1 ">{children}</div>
      </div>
    </div>
  );
}
