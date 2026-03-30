type Level = "Elementary" | "Middle School" | "High School" | "College";

const levels: Level[] = ["Elementary", "Middle School", "High School", "College"];

export default function LevelSelector({
  level,
  setLevel,
}: {
  level: Level;
  setLevel: (value: Level) => void;
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#54757f]">
        Your Level
      </h3>

      <div className="flex flex-wrap gap-3">
        {levels.map((item) => {
          const active = item === level;

          return (
            <button
              key={item}
              onClick={() => setLevel(item)}
              className={`rounded-full border px-5 py-2 text-[15px] font-medium transition ${
                active
                  ? "border-[#2e8a99] bg-[#2e8a99] text-white"
                  : "border-[#b9d5da] bg-white text-[#607a83] hover:border-[#2e8a99]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
