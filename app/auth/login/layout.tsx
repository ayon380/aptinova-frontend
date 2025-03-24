import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Login",
  description: "Login to Aptinova",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
