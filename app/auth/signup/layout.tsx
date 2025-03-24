import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | SignUp",
  description: "Sign up for Aptinova",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
