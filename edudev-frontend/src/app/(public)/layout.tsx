export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Public Topbar/Header can go here */}
      <main className="flex-1 flex flex-col">{children}</main>
      {/* Public Footer can go here */}
    </div>
  );
}
