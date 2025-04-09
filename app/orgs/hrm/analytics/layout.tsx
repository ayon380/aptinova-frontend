import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Analytics",
  description: "Aptinova HRM Analytics",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
