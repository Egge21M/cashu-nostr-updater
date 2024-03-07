import { Event, EventTemplate, SimplePool } from "nostr-tools";
import { useEffect, useMemo, useState } from "react";

const fallBackRelays = [
  "wss://relay.damus.io",
  "wss://nostr21.com",
  "wss://relay.primal.net",
  "wss://relay.nostr.band",
];

const pool = new SimplePool();

function Step3({
  next,
  back,
  pk,
  mints,
}: {
  next: () => void;
  back: () => void;
  pk: string;
  mints: string;
}) {
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<Event>();
  const [relays, setRelays] = useState<Event>();
  const writeRelays = useMemo(() => {
    const overwrite = localStorage.getItem("overwriteRelays");
    if (overwrite) {
      return JSON.parse(overwrite);
    } else if (relays) {
      return relays.tags
        .filter((r) => r[2] === undefined || r[2] === "write")
        .map((r) => r[1]);
    } else {
      return fallBackRelays;
    }
  }, [relays]);
  useEffect(() => {
    const allProfileEvents: Event[] = [];
    const allRelayEvents: Event[] = [];
    pool.subscribeMany(fallBackRelays, [{ authors: [pk], kinds: [0, 10002] }], {
      onevent: (e) => {
        if (e.kind === 0) {
          allProfileEvents.push(e);
        } else if (e.kind === 10002) {
          allRelayEvents.push(e);
        }
      },
      oneose: () => {
        const [mostRecentProfile] = allProfileEvents.sort(
          (a, b) => b.created_at - a.created_at,
        );
        const [mostRecentRelays] = allRelayEvents.sort(
          (a, b) => b.created_at - a.created_at,
        );

        setProfile(mostRecentProfile);
        setRelays(mostRecentRelays);
      },
    });
  }, [pk]);

  async function clickHandler() {
    try {
      const template: EventTemplate = {
        created_at: Math.floor(Date.now() / 1000),
        content: JSON.stringify({
          ...JSON.parse(profile!.content),

          cashu: {
            mints: mints.split(",").map((m) => ({ url: m })),
          },
        }),
        tags: profile!.tags,
        kind: 0,
      };
      const signedEvent = await window.nostr.signEvent(template);
      await Promise.allSettled(pool.publish(writeRelays, signedEvent));
      next();
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-2 max-w-96 w-full items-center text-center bg-zinc-700 p-4 rounded shadow-xl">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-96 mx-4 items-center text-center bg-zinc-700 p-4 rounded shadow-xl">
      <h1>Confirm update</h1>
      <div className="grid grid-cols-1 gap-2 text-xs text-left">
        <div className="p-2 bg-zinc-900 rounded">
          <pre className="text-wrap break-words">
            {JSON.stringify(JSON.parse(profile.content), null, 2)}
          </pre>
        </div>
        <div className="p-2 bg-zinc-900 rounded">
          <pre className="text-wrap break-words">
            {JSON.stringify(
              {
                ...JSON.parse(profile.content),
                cashu: {
                  mints: mints.split(",").map((m) => ({ url: m })),
                },
              },
              null,
              2,
            )}
          </pre>
        </div>
      </div>
      {error ? <p className="text-red-500">{error}</p> : undefined}
      <p className="text-xs">
        Confirm that your updated profile should be published to these relays{" "}
        {writeRelays.join(", ")}
      </p>
      <div className="flex gap-2">
        <button onClick={back}>Back</button>
        <button onClick={clickHandler}>Confirm</button>
      </div>
    </div>
  );
}

export default Step3;
