import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Profile",
  description: "update your profile",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
