export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-full bg-white dark:bg-slate-950">{children}</div>;
}
