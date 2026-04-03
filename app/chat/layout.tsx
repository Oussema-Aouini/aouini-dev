import type { Metadata } from "next";

const title = "Portfolio assistant — AOUINI.DEV";
const description =
  "Chat with Oussema's AI assistant about projects, skills, and contact options.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
};

export default function ChatLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
