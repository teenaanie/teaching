export const metadata = { title: "Admin", robots: { index: false } };

// Admin pages show live, per-teacher data, so they render per request.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
