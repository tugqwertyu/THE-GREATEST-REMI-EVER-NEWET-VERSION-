"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import LevelSelector from "./components/LevelSelector";
import SubjectGrid from "./components/SubjectGrid";
import ActionCards from "./components/ActionCards";
import SessionInput from "./components/SessionInput";

type Level = "Elementary" | "Middle School" | "High School" | "College";
type Subject = "General" | "Math" | "Science" | "English" | "History";
type Mode = "Understand a topic" | "Practice problems" | "Get feedback" | "Quiz yourself";

type SessionRecord = {
  id: string;
  title: string;
};

type TutorResponse = {
  explanation: string;
  diagram: string;
  practice: string;
  raw?: string;
};

const DEFAULT_RECENT: SessionRecord[] = [
  { id: "1", title: "how is quantum physics work" },
];

export default function Home() {
  const [level, setLevel] = useState<Level>("High School");
  const [subject, setSubject] = useState<Subject>("General");
  const [mode, setMode] = useState<Mode>("Understand a topic");
  const [topic, setTopic] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionRecord[]>(DEFAULT_RECENT);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TutorResponse | null>(null);
  const [error, setError] = useState("");
  const responseRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("remi_recent_sessions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SessionRecord[];
        if (Array.isArray(parsed) && parsed.length) {
          setRecentSessions(parsed);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("remi_recent_sessions", JSON.stringify(recentSessions));
  }, [recentSessions]);

  const canSubmit = useMemo(() => topic.trim().length > 0 || files.length > 0, [topic, files]);

  async function handleBeginSession() {
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("topic", topic);
      formData.append("level", level);
      formData.append("subject", subject);
      formData.append("mode", mode);

      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/tutor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      const nextTitle =
        topic.trim() || (files[0] ? `question about ${files[0].name}` : "new session");

      const newSession: SessionRecord = {
        id: crypto.randomUUID(),
        title: nextTitle.toLowerCase(),
      };

      setRecentSessions((prev) => [newSession, ...prev].slice(0, 8));
      setResponse(data);

      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewSession() {
    setTopic("");
    setFiles([]);
    setResponse(null);
    setError("");
    setMode("Understand a topic");
    setSubject("General");
  }

  return (
    <main className="min-h-screen bg-[#edf5f7] text-slate-800">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar
          recentSessions={recentSessions}
          onNewSession={handleNewSession}
        />

        <section className="px-6 py-7 md:px-10">
          <div className="mx-auto max-w-[980px]">
            <LevelSelector level={level} setLevel={setLevel} />

            <div className="mt-8">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#54757f]">
                Subject
              </h3>
              <SubjectGrid subject={subject} setSubject={setSubject} />
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#54757f]">
                What do you want to do?
              </h3>
              <ActionCards mode={mode} setMode={setMode} />
            </div>

            <div className="mt-10 rounded-[26px] border border-[#b9d5da] bg-white p-6 shadow-[0_6px_18px_rgba(37,78,89,0.06)]">
              <label className="mb-4 block text-[15px] font-semibold text-[#4f6f79]">
                What topic would you like to {mode === "Understand a topic" ? "understand" : "work on"}?
              </label>

              <SessionInput
                topic={topic}
                setTopic={setTopic}
                files={files}
                setFiles={setFiles}
                onSubmit={handleBeginSession}
                loading={loading}
              />

              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleBeginSession}
                  disabled={!canSubmit || loading}
                  className="rounded-2xl bg-[#2e8a99] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#256f7b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Building session..." : "Begin Session →"}
                </button>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {response ? (
              <div
                ref={responseRef}
                className="mt-10 space-y-4"
              >
                <ResponseCard title="Explanation" content={response.explanation} />
                <ResponseCard title="Diagram" content={response.diagram} />
                <ResponseCard title="Practice" content={response.practice} />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function ResponseCard({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-[26px] border border-[#b9d5da] bg-white p-6 shadow-[0_6px_18px_rgba(37,78,89,0.06)]">
      <h4 className="mb-3 text-lg font-semibold text-[#24434d]">{title}</h4>
      <div className="whitespace-pre-wrap leading-7 text-slate-700">{content}</div>
    </section>
  );
}
