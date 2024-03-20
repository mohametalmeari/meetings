import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-violet-50 min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
