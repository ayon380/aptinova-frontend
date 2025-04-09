import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Dashboard",
  description: "Aptinova HRM Dashboard",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
