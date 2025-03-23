import { MessageSidebar } from "@/components/messages/message-sidebar";

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <MessageSidebar />
      <main className="h-full md:ml-[350px]">
        {children}
      </main>
    </div>
  );
}