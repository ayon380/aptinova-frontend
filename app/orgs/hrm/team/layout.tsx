import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Team",
  description: "Aptinova HRM Team",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
