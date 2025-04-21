import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Job Applicants",
  description: "Aptinova HRM Job Applicants",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
