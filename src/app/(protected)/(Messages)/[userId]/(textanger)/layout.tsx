import { MessageSidebar } from "@/components/messages/message-sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { SocketProvider } from "@/components/providers/socket-provider";

export default async function MessageLayout({
  children,
  params, // Add params here
}: {
  children: React.ReactNode;
  params: { userId: string }; // Type definition for params
}) {
  const awaitedParams = await params;
  return (
    <div className="h-full">
      <MessageSidebar userId={awaitedParams.userId} /> 
      <SocketProvider>
      <QueryProvider>
      <main className="h-full md:ml-[350px]">
        {children}
      </main>
      </QueryProvider>
      </SocketProvider>
    </div>
  );
}
