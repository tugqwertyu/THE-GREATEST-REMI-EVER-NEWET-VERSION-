type Subject = "General" | "Math" | "Science" | "English" | "History";

const subjects: { label: Subject; icon: string }[] = [
  { label: "General", icon: "◎" },
  { label: "Math", icon: "∑" },
  { label: "Science", icon: "⚗" },
  { label: "English", icon: "✍" },
  { label: "History", icon: "📜" },
];

export default function SubjectGrid({
  subject,
  setSubject,
}: {
  subject: Subject;
  setSubject: (value: Subject) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {subjects.map((item) => {
        const active = item.label === subject;

        return (
          <button
            key={item.label}
            onClick={() => setSubject(item.label)}
            className={`rounded-[22px] border p-6 text-center transition ${
              active
                ? "border-[#2e8a99] bg-[#e9f5f7]"
                : "border-[#b9d5da] bg-white hover:border-[#2e8a99]"
            }`}
          >
            <div className="mb-3 text-3xl">{item.icon}</div>
            <div className="font-semibold text-[#2f5360]">{item.label}</div>
          </button>
        );
      })}
    </div>
  );
}
