import AdminNavbar from "@/components/admin/adminNav";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--color-bg)",
            }}>
            <AdminNavbar />
            <main className="ml-64 min-h-screen">{children}</main>
        </div>
    );
}