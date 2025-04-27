import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Downloads",
  description: "Aptinova Downloads",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
