import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "Privacy Notice in compliance with the Digital Personal Data Protection (DPDP) Act, 2023 of India.",
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
