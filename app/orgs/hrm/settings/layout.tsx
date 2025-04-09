import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Settings",
  description: "update your Settings",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
