import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";

export default async function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AppHeader />
      {children}
      <BottomNav />
    </>
  );
}
