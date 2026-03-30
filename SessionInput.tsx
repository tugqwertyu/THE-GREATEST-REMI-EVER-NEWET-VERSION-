"use client";

import { DragEvent, KeyboardEvent, useRef } from "react";

export default function SessionInput({
  topic,
  setTopic,
  files,
  setFiles,
  onSubmit,
  loading,
}: {
  topic: string;
  setTopic: (value: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function addFiles(nextFiles: FileList | null) {
    if (!nextFiles) return;
    const asArray = Array.from(nextFiles);
    setFiles([...files, ...asArray]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) {
      onSubmit();
    }
  }

  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-[#bdd6db] bg-[#f5fbfc] p-5 text-sm text-[#6d8a93] hover:bg-[#eef7f9]"
      >
        Drag and drop a PDF, image, or text file here — or click to upload
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-full border border-[#bdd6db] bg-[#eef7f9] px-3 py-2 text-sm text-[#46646d]"
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="font-bold text-[#2e8a99]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Quadratic equations, the French Revolution, photosynthesis..."
        className="w-full rounded-2xl border border-[#bdd6db] bg-[#f8fcfd] px-5 py-4 text-[17px] text-slate-800 outline-none placeholder:text-[#7f99a1] focus:border-[#2e8a99]"
      />
    </div>
  );
}
