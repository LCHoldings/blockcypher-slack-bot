export const convertPrefenceToEmoji = (preference: string): string => {
    if (preference === "low") {
        return "🔽";
    } else if (preference === "medium") {
        return "⏺️";
    } else if (preference === "high") {
        return "🔼";
    } else {
        return "❓";
    }
}