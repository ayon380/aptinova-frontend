import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";

export default async function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-dvh w-screen overflow-hidden">
      <AppHeader />
      <div className="flex h-full w-full">
        <BottomNav />
        {children}
      </div>
    </div>
  );
}
