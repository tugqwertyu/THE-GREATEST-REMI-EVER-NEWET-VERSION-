type SessionRecord = {
  id: string;
  title: string;
};

export default function Sidebar({
  recentSessions,
  onNewSession,
}: {
  recentSessions: SessionRecord[];
  onNewSession: () => void;
}) {
  return (
    <aside className="border-r border-[#c7dde1] bg-[#dfecef]">
      <div className="p-5">
        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="pt-1 text-xl text-[#2e8a99]">⋰</div>
            <div>
              <h1 className="font-serif text-[42px] italic leading-none text-[#2e8a99]">
                Remi
              </h1>
              <p className="mt-2 font-serif text-sm italic text-[#6d8a93]">
                Clarity in Learning
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onNewSession}
          className="w-full rounded-2xl border border-[#bdd6db] bg-white px-4 py-3 text-left font-semibold text-[#2e8a99] shadow-sm hover:bg-[#f8fcfd]"
        >
          + New Session
        </button>

        <div className="mt-7">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#6a8790]">
            Recent Sessions
          </h2>

          <ul className="space-y-3">
            {recentSessions.map((session) => (
              <li
                key={session.id}
                className="flex items-start gap-2 text-[15px] text-slate-700"
              >
                <span className="mt-[7px] h-2 w-2 rounded-full bg-[#6a8790]" />
                <span>{session.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
