import { MessageSidebar } from "@/components/messages/message-sidebar";

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
      <main className="h-full md:ml-[350px]">
        {children}
      </main>
    </div>
  );
}
