
const activities = [
    {
        id: 1,
        action: "Booking Created",
        description: "A new booking was created.",
        user: "Administrator",
        date: "Oct 17, 2026, 10:30 AM",
        type: "booking",
    },
    {
        id: 2,
        action: "Room Updated",
        description: "Room information was modified.",
        user: "Administrator",
        date: "Oct 17, 2026, 9:45 AM",
        type: "room",
    },
    {
        id: 3,
        action: "Amenity Added",
        description: "A new resort amenity was added.",
        user: "Administrator",
        date: "Oct 16, 2026, 3:20 PM",
        type: "amenity",
    },
];

function getActivityColor(type: string) {
    switch (type) {
        case "booking":
            return {
                backgroundColor: "var(--color-forest-100)",
                color: "var(--color-forest-700)",
            };
        case "room":
            return {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
            };
        case "amenity":
            return {
                backgroundColor: "#fef3c7",
                color: "#92400e",
            };
        default:
            return {
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
            };
    }
}

export default function ActivitiesPage() {
    return (
        <main className="min-h-screen px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">
                <header>
                    <p
                        className="text-sm font-medium"
                        style={{
                            color: "var(--color-forest-500)",
                        }}>
                        Activity Logs
                    </p>
                    <h1
                        className="mt-1 text-3xl font-bold"
                        style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--color-forest-900)",
                        }}>
                        Activites Overview
                    </h1>
                </header>
                <section
                    className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm"
                    style={{ borderColor: "var(--color-border)" }}>
                    <div
                        className="border-b px-6 py-4"
                        style={{ borderColor: "var(--color-border)" }}>
                        <h2
                            className="font-semibold"
                            style={{ color: "var(--color-forest-900)" }}>
                            Recent Activities
                        </h2>
                    </div>

                    {activities.length > 0 ? (
                        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div
                                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                                            style={getActivityColor(activity.type)}>
                                            <span aria-hidden="true">
                                                {activity.type === "booking"
                                                    ? "B"
                                                    : activity.type === "room"
                                                        ? "R"
                                                        : "A"}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <h3
                                                className="font-semibold"
                                                style={{ color: "var(--color-forest-900)" }}>
                                                {activity.action}
                                            </h3>
                                            <p
                                                className="mt-1 text-sm"
                                                style={{ color: "var(--color-muted)" }}>
                                                {activity.description}
                                            </p>

                                            <p
                                                className="mt-2 text-xs"
                                                style={{ color: "var(--color-muted)" }}>
                                                Performed by: {activity.user}
                                            </p>
                                        </div>
                                    </div>

                                    <time
                                        className="shrink-0 text-xs sm:text-right"
                                        style={{ color: "var(--color-muted)" }}>
                                        {activity.date}
                                    </time>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <p
                                className="font-medium"
                                style={{ color: "var(--color-forest-900)" }}>
                                No activities recorded
                            </p>
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "var(--color-muted)" }}>
                                Administrative activities will appear here.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}