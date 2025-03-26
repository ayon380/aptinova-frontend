import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Terms of Service",
  description: "Terms of service for Aptinova",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
