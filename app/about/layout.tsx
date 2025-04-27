import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | About",
  description: "Aptinova About",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
