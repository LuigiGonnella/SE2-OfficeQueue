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
import type {Counter, Service, QueueEntry, Ticket} from "../API/types.ts";


const API = (() => {
  const BASE_URL = "http://localhost:8080/api/v1";

  return {
    async fetchCounters(): Promise<Counter[]> {
      const res = await fetch(`${BASE_URL}/counters`);
      if (!res.ok) throw new Error("Cannot load counters.");
      return res.json();
    },
    async fetchServicesByCounter(counterId: number): Promise<Service[]> {
      const res = await fetch(`${BASE_URL}/counters/${counterId}/services`);
      if (!res.ok) throw new Error("Cannot load services for this counter.");
      return res.json();
    },
    async fetchServedTicketsByCounterGrouped(counterId: number): Promise<Record<string, QueueEntry[]>> {
      const res = await fetch(`${BASE_URL}/queues/served/${counterId}`);
      if (!res.ok) throw new Error("Cannot load served tickets for the counter.");
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
      if (!res.ok) throw new Error("Error while calling the next ticket.");
      return res.json();
    },
    async closeTicket(ticketId: number): Promise<void> {
      const res = await fetch(`${BASE_URL}/queues/${ticketId}/close`, { method: "POST" });
      if (!res.ok) throw new Error("Error while closing the ticket.");
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
      .catch((e: any) => setError(e.message ?? "Error loading counters."))
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
      .catch((e: any) => setError(e.message ?? "Error loading counter data."))
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
      if (!t) setError("No customer can be served at this counter at the moment.");
      setCurrentTicket(t ?? null);
    } catch (e: any) {
      setError(e.message ?? "Error while calling the next customer.");
    } finally {
      setLoadingNext(false);
    }
  };

  const finalizeTicket = async () => {
    if (!currentTicket) return;
    setLoadingNext(true);
    try {
      await API.closeTicket(currentTicket.id);
      setCurrentTicket(null);
      if (selectedCounterId != null) {
        const grouped = await API.fetchServedTicketsByCounterGrouped(selectedCounterId);
        setServedByService(grouped);
      }
    } catch (e: any) {
      setError(e.message ?? "Error when closing the ticket.");
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
      <>
        <style>
          {`
          body {
            background-color: #f8f9fa;
          }
        `}
        </style>

        <Container fluid className="py-4" style={{ minHeight: '100vh' }}>
          <Row className="mb-4">
            <Col>
              <h1 className="text-center text-dark fw-bold border-bottom border-primary border-3 pb-3 mb-4">
                Officer Panel
              </h1>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={{ span: 6, offset: 3 }}>
              <Card className="border-dark border-2 shadow-sm">
                <Card.Body>
                  <Form.Group controlId="counterSelect">
                    <Form.Label className="fw-semibold text-dark">Select Counter</Form.Label>
                    <Form.Select
                        value={selectedCounterId != null ? String(selectedCounterId) : ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSelectedCounterId(v ? Number(v) : null);
                        }}
                        disabled={loading || loadingNext}
                        className="border-2"
                    >
                      <option value="">-- Select --</option>
                      {counters.map((c) => (
                          <option key={c.counter_code} value={String(c.counter_code)}>
                            Counter {c.counter_code}
                          </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {error && (
              <Row className="mb-3">
                <Col md={{ span: 8, offset: 2 }}>
                  <Alert variant="warning" dismissible onClose={() => setError(null)} className="border-2">
                    <strong>Warning:</strong> {error}
                  </Alert>
                </Col>
              </Row>
          )}

          <Row>
            <Col md={6} className="mb-4">
              <Card className="border-dark border-2 shadow-sm">
                <Card.Header className="bg-white border-bottom border-dark border-2 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-dark">Actions</h4>
                  {loading && (
                      <span className="text-secondary">
                    <Spinner size="sm" animation="border" /> Loading...
                  </span>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className="d-flex gap-2 align-items-center mb-3">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onCallNext}
                        disabled={selectedCounterId == null || !!currentTicket || loadingNext}
                    >
                      {loadingNext ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" /> Loading...
                          </>
                      ) : (
                          "Call Next Customer"
                      )}
                    </Button>
                  </div>

                  {currentTicket && (
                      <Card className="border-primary border-3 shadow-sm">
                        <Card.Header className="bg-white border-bottom border-primary border-2 text-center">
                          <h5 className="mb-0 text-dark fw-bold">Current Ticket</h5>
                        </Card.Header>
                        <Card.Body className="text-center py-4">
                          <Badge bg="primary" className="fs-3 px-4 py-3 mb-3">
                            Ticket #{currentTicket.id}
                          </Badge>
                          <h5 className="text-dark mt-3 mb-3">Service: {currentTicket.service.name}</h5>
                          <Button
                              variant="success"
                              size="lg"
                              onClick={() => finalizeTicket()}
                              disabled={loadingNext}
                              className="px-4"
                          >
                            Mark as Done
                          </Button>
                        </Card.Body>
                      </Card>
                  )}

                  {!currentTicket && (
                      <div className="text-center text-secondary py-4">
                        No customer currently being served.
                      </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="border-dark border-2 shadow-sm">
                <Card.Header className="bg-white border-bottom border-dark border-2">
                  <h4 className="mb-0 text-dark">Served Customers History</h4>
                </Card.Header>
                <Card.Body>
                  {selectedCounterId == null && (
                      <div className="text-center text-secondary py-4">
                        Select a counter to view history.
                      </div>
                  )}
                  {selectedCounterId != null && servicesWithServed.length === 0 && !loading && (
                      <div className="text-center text-secondary py-4">
                        No services available for this counter.
                      </div>
                  )}
                  {selectedCounterId != null && servicesWithServed.length > 0 && (
                      <Accordion alwaysOpen>
                        {servicesWithServed.map((s) => (
                            <Accordion.Item eventKey={s.name} key={s.name} className="border mb-2">
                              <Accordion.Header>
                                <span className="text-dark fw-semibold">{s.name}</span>
                                <Badge bg="dark" className="ms-2">
                                  {s.served.length}
                                </Badge>
                              </Accordion.Header>
                              <Accordion.Body>
                                {s.served.length === 0 ? (
                                    <div className="text-secondary text-center py-3">
                                      No customers served for this service yet.
                                    </div>
                                ) : (
                                    <ListGroup variant="flush">
                                      {s.served.map((t) => (
                                          <ListGroup.Item key={t.id} className="d-flex justify-content-between align-items-center border-bottom py-3">
                                  <span>
                                    <Badge bg="primary" className="me-2 fs-6 px-3 py-2">
                                      #{t.number}
                                    </Badge>
                                    <span className="text-secondary small">
                                      Served at {t.servedAt ? new Date(t.servedAt).toLocaleString() : "-"}
                                    </span>
                                  </span>
                                            <Badge bg="success" className="px-3 py-2">SERVED</Badge>
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
      </>
  );
}

export default OfficerPanel;
