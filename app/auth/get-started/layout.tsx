import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Get Started",
  description: "Get started with Aptinova",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
