import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | HR Dashboard",
  description: "Aptinova HR Dashboard",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
