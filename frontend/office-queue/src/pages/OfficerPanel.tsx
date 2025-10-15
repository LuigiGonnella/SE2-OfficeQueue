import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Badge,
  Alert,
  Spinner,
  Accordion,
} from "react-bootstrap";
import type {Counter, Service, QueueEntry, Ticket} from "../API/types";

const API = (() => {
  const BASE_URL = "http://localhost:8080/api/v1";

  return {
    async fetchCounters(): Promise<Counter[]> {
      const res = await fetch(`${BASE_URL}/counters`);
      if (!res.ok) throw new Error("Impossibile caricare i counter");
      return res.json();
    },
    async fetchServicesByCounter(counterId: number): Promise<Service[]> {
      const res = await fetch(`${BASE_URL}/counters/${counterId}/services`);
      if (!res.ok) throw new Error("Impossibile caricare i servizi del counter");
      return res.json();
    },
    async fetchServedTicketsByCounterGrouped(counterId: number): Promise<Record<string, QueueEntry[]>> {
      const res = await fetch(`${BASE_URL}/queues/served/${counterId}`);
      if (!res.ok) throw new Error("Impossibile caricare i ticket serviti");
      const tickets: QueueEntry[] = await res.json();
      const grouped: Record<string, QueueEntry[]> = {};
      tickets.forEach((t) => {
        if (!grouped[t.service]) grouped[t.service] = [];
        grouped[t.service].push(t);
      });
      return grouped;
    },
    async callNext(counterId: number): Promise<Ticket | null> {
      const res = await fetch(`${BASE_URL}/queues/next/${counterId}`, { method: "POST" });
      if (res.status === 204) return null;
      if (!res.ok) throw new Error("Errore durante la chiamata del prossimo cliente");
      return res.json();
    },
    async closeTicket(ticketId: number): Promise<void> {
      const res = await fetch(`${BASE_URL}/queues/${ticketId}/close`, { method: "POST" });
      if (!res.ok) throw new Error("Errore durante la chiusura del ticket");
    },
  };
})();

function OfficerPanel() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [selectedCounterId, setSelectedCounterId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [servedByService, setServedByService] = useState<Record<string, QueueEntry[]>>({});
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.fetchCounters()
      .then((res) => mounted && setCounters(res))
      .catch((e: any) => setError(e.message ?? "Errore caricando i counter"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedCounterId == null) {
      setServices([]);
      setServedByService({});
      setCurrentTicket(null);
      return;
    }
    let mounted = true;
    setLoading(true);
    Promise.all([
      API.fetchServicesByCounter(selectedCounterId),
      API.fetchServedTicketsByCounterGrouped(selectedCounterId),
    ])
      .then(([srv, grouped]) => {
        if (!mounted) return;
        setServices(srv);
        setServedByService(grouped);
      })
      .catch((e: any) => setError(e.message ?? "Errore caricando i dati del counter"))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [selectedCounterId]);

  const onCallNext = async () => {
    if (selectedCounterId == null || currentTicket) return;
    setLoadingNext(true);
    setError(null);
    try {
      const t = await API.callNext(selectedCounterId);
      if (!t) setError("Nessun cliente in attesa per questo counter.");
      setCurrentTicket(t ?? null);
    } catch (e: any) {
      setError(e.message ?? "Errore durante la chiamata del prossimo cliente.");
    } finally {
      setLoadingNext(false);
    }
  };

  const finalizeTicket = async () => {
    if (!currentTicket) return;
    setLoadingNext(true);
    try {
      await API.closeTicket(currentTicket.ticket_code);
      setCurrentTicket(null);
      if (selectedCounterId != null) {
        const grouped = await API.fetchServedTicketsByCounterGrouped(selectedCounterId);
        setServedByService(grouped);
      }
    } catch (e: any) {
      setError(e.message ?? "Errore durante la finalizzazione del ticket.");
    } finally {
      setLoadingNext(false);
    }
  };

  const servicesWithServed = useMemo<Array<Service & { served: QueueEntry[] }>>(
    () =>
      services.map((s) => ({
        ...s,
        served: servedByService[s.name] ?? [],
      })),
    [services, servedByService]
  );

  console.log(servicesWithServed);
  console.log(servedByService);
  console.log(services);

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col md={8}>
          <h2>Officer Panel</h2>
        </Col>
        <Col md={4}>
          <Form.Group controlId="counterSelect">
            <Form.Label>Select counter</Form.Label>
            <Form.Select
              value={selectedCounterId != null ? String(selectedCounterId) : ""}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedCounterId(v ? Number(v) : null);
              }}
              disabled={loading || loadingNext}
            >
              <option value="">-- Select --</option>
              {counters.map((c) => (
                <option key={c.counter_code} value={String(c.counter_code)}>
                  {c.counter_code}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Actions</span>
              {loading && (
                <span>
                  <Spinner size="sm" animation="border" /> Loading
                </span>
              )}
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 align-items-center">
                <Button
                  variant="primary"
                  onClick={onCallNext}
                  disabled={selectedCounterId == null || !!currentTicket || loadingNext}
                >
                  {loadingNext ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" /> Loading...
                    </>
                  ) : (
                    "Call next customer"
                  )}
                </Button>
              </div>

              {currentTicket && (
                <Card className="mt-3">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">
                        Ticket: <Badge bg="secondary">{currentTicket.ticket_code}</Badge>
                      </div>
                      <p>Service: {currentTicket.service.name}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="outline-success" onClick={() => finalizeTicket()} disabled={loadingNext}>
                        Done
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {!currentTicket && <div className="text-muted mt-3">No customers served.</div>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Served customers history</Card.Header>
            <Card.Body>
              {selectedCounterId == null && <div className="text-muted">Select a counter to view data.</div>}
              {selectedCounterId != null && servicesWithServed.length === 0 && !loading && (
                <div className="text-muted">No service available for this counter.</div>
              )}
              {selectedCounterId != null && (
                <Accordion alwaysOpen>
                  {servicesWithServed.map((s) => (
                    <Accordion.Item eventKey={s.name} key={s.name}>
                      <Accordion.Header>
                        {s.name}
                        <Badge bg="secondary" className="ms-2">
                          {s.served.length}
                        </Badge>
                      </Accordion.Header>
                      <Accordion.Body>
                        {s.served.length === 0 ? (
                          <div className="text-muted">No customer served for this service.</div>
                        ) : (
                          <ListGroup variant="flush">
                            {s.served.map((t) => (
                              <ListGroup.Item key={t.id} className="d-flex justify-content-between">
                                <span>
                                  <Badge bg="dark" className="me-2">
                                    {t.number}
                                  </Badge>
                                  Served at {t.servedAt ? new Date(t.servedAt).toLocaleString() : "-"}
                                </span>
                                <Badge bg="success">SERVED</Badge>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OfficerPanel;