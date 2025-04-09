import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Candidate | Home",
  description: "Aptinova | Candidate | Home",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
