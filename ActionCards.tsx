type Mode = "Understand a topic" | "Practice problems" | "Get feedback" | "Quiz yourself";

const actions: { title: Mode; icon: string; description: string }[] = [
  {
    title: "Understand a topic",
    icon: "📖",
    description: "Get a clear, in-depth explanation with examples tailored to your level.",
  },
  {
    title: "Practice problems",
    icon: "✏️",
    description: "Work through exercises with step-by-step guidance and instant feedback.",
  },
  {
    title: "Get feedback",
    icon: "💬",
    description: "Submit your work or ideas and receive detailed, constructive feedback.",
  },
  {
    title: "Quiz yourself",
    icon: "🎯",
    description: "Test your knowledge with adaptive questions that reveal what you know.",
  },
];

export default function ActionCards({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (value: Mode) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {actions.map((action) => {
        const active = action.title === mode;

        return (
          <button
            key={action.title}
            onClick={() => setMode(action.title)}
            className={`rounded-[24px] border bg-white p-6 text-left transition ${
              active
                ? "border-[#2e8a99] shadow-[0_6px_18px_rgba(37,78,89,0.06)]"
                : "border-[#b9d5da] hover:border-[#2e8a99]"
            }`}
          >
            <div className="mb-3 text-3xl">{action.icon}</div>
            <h4 className="mb-2 text-[18px] font-semibold text-[#243f49]">
              {action.title}
            </h4>
            <p className="max-w-[420px] text-[15px] leading-7 text-[#607a83]">
              {action.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
