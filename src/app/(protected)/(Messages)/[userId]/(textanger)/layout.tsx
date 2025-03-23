import { MessageSidebar } from "@/components/messages/message-sidebar";

export default function MessageLayout({
  children,
  params, // Add params here
}: {
  children: React.ReactNode;
  params: { userId: string }; // Type definition for params
}) {
  return (
    <div className="h-full">
      <MessageSidebar userId={params.userId} /> {/* Pass userId */}
      <main className="h-full md:ml-[350px]">
        {children}
      </main>
    </div>
  );
}
