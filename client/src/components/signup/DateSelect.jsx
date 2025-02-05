export default function DateSelect() {
  return (
    <div>
      <select name="day" id="day" defaultValue="default" required>
        <option value="default" disabled>
          DD
        </option>
        {[...Array(31)].map((_, i) => (
          <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
            {(i + 1).toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <select name="month" id="month" defaultValue="default" required>
        <option value="default" disabled>
          MM
        </option>
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
            {(i + 1).toString().padStart(2, "0")}
          </option>
        ))}
      </select>
      <select name="year" id="year" defaultValue="default" required>
        <option value="default" disabled>
          YYYY
        </option>
        {[...Array(100)].map((_, i) => (
          <option key={2025 - i} value={2025 - i}>
            {2025 - i}
          </option>
        ))}
      </select>
    </div>
  );
}
