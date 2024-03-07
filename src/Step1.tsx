import { useState } from "react";

function Step1({
  next,
  setPk,
}: {
  next: () => void;
  setPk: (pk: string) => void;
}) {
  const [error, setError] = useState("");
  async function clickHandler() {
    try {
      const pk = await window.nostr.getPublicKey();
      setPk(pk);
      next();
    } catch {
      setError("Could not login. Do you have a NIP-05 provider installed?");
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-96 4 items-center text-center bg-zinc-700 p-4 rounded shadow-xl">
      <h1>Step 1</h1>
      <p>
        In order for this website to read and publish your profile data, you
        need to login with an NIP-05 provider
      </p>
      {error ? <p className="text-red-500">{error}</p> : undefined}
      <button onClick={clickHandler}>Login with Nip-05</button>
    </div>
  );
}

export default Step1;
