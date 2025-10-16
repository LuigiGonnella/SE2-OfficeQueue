import { useEffect, useState } from "react";

type BoardCall = {
  ticket: number;
  counter: string | number;
  service: string;
};

type QueueRow = {
  service_id: number;
  service_name: string;
  queue: number;
};

export default function BoardPage() {
  const [calls, setCalls] = useState<BoardCall[]>([]);
  const [queues, setQueues] = useState<QueueRow[]>([]);

  const BASE_URL = "http://localhost:8080/api/v1"

  useEffect(() => {
    // initial load
    setInterval(() => {
      fetch(BASE_URL+"/board/current").then(r => r.json()).then(setCalls);
      fetch(BASE_URL+"/board/queues").then(r => r.json()).then(setQueues);
    }, 500);

    // live updates via SSE
    // const evt = new EventSource(BASE_URL+"/board/stream");
    // evt.onmessage = (e) => {
    //   const update: BoardCall = JSON.parse(e.data);
    //   setCalls(prev => [update, ...prev.slice(0, 9)]);
    // };
    // evt.onerror = () => {
    //   // optional: reconnect logic
    // };
    //
    // return () => evt.close();
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      {calls.length > 0 &&
      <h1>Now Serving: {calls[0].ticket} at Counter: {calls[0].counter}</h1>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <h2>Recent Calls</h2>
          <ul>
            {calls.slice(1).map((c, i) => (
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
