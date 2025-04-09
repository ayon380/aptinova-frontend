import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aptinova | Create Job",
  description: "Create a new job",
};

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
