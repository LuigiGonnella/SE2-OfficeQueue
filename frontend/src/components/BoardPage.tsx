import { useEffect, useState } from "react";
import {Badge, Card, Col, Container, ListGroup, Row} from "react-bootstrap";

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
  const [flash, setFlash] = useState(false);

  const BASE_URL = "http://localhost:8080/api/v1";

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(BASE_URL + "/board/current")
          .then(r => r.json())
          .then((newCalls: BoardCall[]) => {
            setCalls(prev => {
              if (prev.length > 0 && newCalls.length > 0 && prev[0].ticket !== newCalls[0].ticket) {
                setFlash(true);
                setTimeout(() => setFlash(false), 1500);
              }
              return newCalls;
            });
          });
      fetch(BASE_URL + "/board/queues").then(r => r.json()).then(setQueues);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
      <>
        <style>
          {`
          @keyframes flash {
            0%, 100% { opacity: 1; transform: scale(1); }
            25% { opacity: 0.85; transform: scale(1.02); box-shadow: 0 0 20px rgba(13, 110, 253, 0.4); }
            50% { opacity: 1; transform: scale(1.04); box-shadow: 0 0 30px rgba(13, 110, 253, 0.6); }
            75% { opacity: 0.85; transform: scale(1.02); box-shadow: 0 0 20px rgba(13, 110, 253, 0.4); }
          }
          .flash-animation {
            animation: flash 1.5s ease-in-out;
          }
          body {
            background-color: #f8f9fa;
            min-height: 100vh;
          }
        `}
        </style>

        <Container fluid className="py-4">
          <h1 className="text-center text-dark fw-bold mb-4 border-bottom border-primary border-3 pb-3">
            Office Queue Board
          </h1>

          {calls.length > 0 && (
              <Card
                  className={`mb-4 border-primary border-3 shadow ${flash ? "flash-animation" : ""}`}
                  style={{ backgroundColor: '#ffffff' }}
              >
                <Card.Body className="text-center py-5">
                  <h6 className="text-uppercase fw-bold mb-3 text-secondary">Now Serving</h6>
                  <h1 className="display-1 fw-bold text-primary">Ticket #{calls[0].ticket}</h1>
                  <h2 className="display-6 text-dark">Counter {calls[0].counter}</h2>
                </Card.Body>
              </Card>
          )}

          <Row>
            <Col lg={6} className="mb-4">
              <Card className="border-dark border-2 shadow-sm">
                <Card.Header className="bg-white border-bottom border-dark border-2">
                  <h4 className="mb-0 text-dark">Recent Calls</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  {calls.slice(1).map((c, i) => (
                      <ListGroup.Item
                          key={i}
                          className="d-flex align-items-center gap-3 border-bottom"
                      >
                        <Badge bg="primary" className="fs-5 px-3 py-2">#{c.ticket}</Badge>
                        <span className="fs-4 text-secondary">→</span>
                        <Badge bg="dark" className="px-3 py-2">Counter {c.counter}</Badge>
                        <span className="ms-auto text-secondary small">{c.service}</span>
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="border-dark border-2 shadow-sm">
                <Card.Header className="bg-white border-bottom border-dark border-2">
                  <h4 className="mb-0 text-dark">Waiting Queues</h4>
                </Card.Header>
                <ListGroup variant="flush">
                  {queues.map((q) => (
                      <ListGroup.Item
                          key={q.service_id}
                          className="d-flex justify-content-between align-items-center border-bottom"
                      >
                        <span className="fw-semibold fs-5 text-dark">
                          {q.service_name || `Service #${q.service_id}`}
                        </span>
                        <Badge bg="primary" pill className="fs-5 px-3 py-2">{q.queue}</Badge>
                      </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
  );
}