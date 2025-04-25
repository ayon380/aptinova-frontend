import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | HR Profile",
  description: "Aptinova HRM Profile",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
