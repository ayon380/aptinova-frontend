import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Jobs",
  description: "find your dream job",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
