export default function AdminDashboard() {
    return (
        <section className="min-h-screen px-8 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Overview
                    </p>

                    <h1
                        className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Dashboard
                    </h1>
                </div>
            </div>
        </section>
    );
}