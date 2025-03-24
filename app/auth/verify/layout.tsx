import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Verify",
  description: "verify your email",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
