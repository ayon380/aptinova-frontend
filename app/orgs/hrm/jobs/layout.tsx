import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Org Jobs",
  description: "Aptinova HRM Jobs",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
