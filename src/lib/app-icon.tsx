// Raw path data from lucide-react's "receipt" icon (ISC licensed), embedded
// directly rather than imported: lucide's icon components are client-tagged
// and can't be rendered inside the server-only ImageResponse used here.
const RECEIPT_PATHS = [
  "M12 17V7",
  "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8",
  "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",
];

export function InvoiceIconMark({
  size,
  rounded = true,
}: {
  size: number;
  rounded?: boolean;
}) {
  const glyphSize = Math.round(size * 0.58);
  const strokeWidth = size <= 48 ? 2.75 : 1.75;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#18181b",
        borderRadius: rounded ? Math.round(size * 0.22) : 0,
      }}
    >
      <svg
        width={glyphSize}
        height={glyphSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fafafa"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {RECEIPT_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </div>
  );
}
