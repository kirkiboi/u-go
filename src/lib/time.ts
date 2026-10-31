export function normalizeTime(value: string): string {
    const time = value.trim().toUpperCase();
    const twentyFourHour = time.match(/^(\d{1,2}):(\d{2})$/);

    if (twentyFourHour) {
        const hours = Number(twentyFourHour[1]);
        const minutes = Number(twentyFourHour[2]);

        if (hours > 23 || minutes > 59) {
            throw new Error("Invalid time value.");
        }
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    const twelveHour = time.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|NN)$/);

    if (twelveHour) {
        let hours = Number(twelveHour[1]);
        const minutes = Number(twelveHour[2] ?? "0");
        const period = twelveHour[3];

        if (hours < 1 || hours > 12 || minutes > 59) {
            throw new Error("Invalid time value.");
        }

        if (period === "NN") {
            hours = 12;
        } else if (period === "AM") {
            hours = hours === 12 ? 0 : hours;
        } else {
            hours = hours === 12 ? 12 : hours + 12;
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }

    throw new Error("Invalid time format. Use HH:mm.");
}

export function formatTime(value: string | null | undefined): string {
    if (!value) return "—";

    try {
        const normalized = normalizeTime(value);
        const [hours, minutes] = normalized.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const displayHour = hours % 12 || 12;
        return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
    } catch {
        return value;
    }
}
