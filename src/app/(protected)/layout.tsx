// src/app/(protected)/layout.tsx

import TopBar from "@/components/common/TopBar";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gray-950"> {/* Changed bg-gray-50 to bg-black */}
    <TopBar />
      {children} {/* Removed container, padding and margin classes */}
    </div>
  );
}