import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Help Centre",
  description: "Help Centre",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
