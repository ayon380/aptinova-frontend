import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Privacy Policy",
  description: "Privacy policy for Aptinova",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
