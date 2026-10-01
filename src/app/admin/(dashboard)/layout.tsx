import AdminNavbar from "@/components/admin/adminNav";
import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/admin/login");
    }
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