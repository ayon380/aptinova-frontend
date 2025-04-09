import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Job Details",
  description: "Aptinova HRM Job Details",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
