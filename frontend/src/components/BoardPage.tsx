import { useEffect, useState } from "react";

type BoardCall = {
  ticket: string;
  counter: string | number;
  service: string;
  at: string;
};

type QueueRow = {
  service_id: number;
  service_name: string;
  queue: number;
};

export default function BoardPage() {
  const [calls, setCalls] = useState<BoardCall[]>([]);
  const [queues, setQueues] = useState<QueueRow[]>([]);

  useEffect(() => {
    // initial load
    fetch("/api/v1/board/current").then(r => r.json()).then(setCalls);
    fetch("/api/v1/board/queues").then(r => r.json()).then(setQueues);

    // live updates via SSE
    const evt = new EventSource("/api/v1/board/stream");
    evt.onmessage = (e) => {
      const update: BoardCall = JSON.parse(e.data);
      setCalls(prev => [update, ...prev.slice(0, 9)]);
    };
    evt.onerror = () => {
      // optional: reconnect logic
    };

    return () => evt.close();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Now Serving</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h2>Recent Calls</h2>
          <ul>
            {calls.map((c, i) => (
              <li key={i}>
                <strong>{c.ticket}</strong> → Counter <strong>{c.counter}</strong> ({c.service})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Queues</h2>
          <ul>
            {queues.map((q) => (
              <li key={q.service_id}>
                {q.service_name || `Service #${q.service_id}`}: {q.queue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
