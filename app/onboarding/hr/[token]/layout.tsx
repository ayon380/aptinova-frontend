import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Onboarding",
  description: "Onboarding for HR",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
