import { useRef, useState } from "react";

function Step2({
  next,
  setMints,
}: {
  next: () => void;
  setMints: (mints: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  async function clickHandler() {
    if (!inputRef.current?.value) {
      return;
    }
    setMints(inputRef.current.value);
    next();
  }

  return (
    <div className="flex flex-col gap-2 max-w-96 w-full items-center text-center bg-zinc-700 p-4 rounded shadow-xl">
      <h1>Step 2</h1>
      <label htmlFor="mints">Your preferred mints (seperated by comma)</label>
      <input
        type="text"
        id="mints"
        ref={inputRef}
        className="bg-zinc-900 p-2 rounded"
      />
      <button onClick={clickHandler}>Preview profile</button>
    </div>
  );
}

export default Step2;
