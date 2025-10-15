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
import type {Counter, Service, Ticket} from "../API/types.ts";


const API = (() => {
    const BASE_URL = "http://localhost:8080/api/v1";

    return {
        async fetchCounters(): Promise<Counter[]> {
            return await fetch(BASE_URL+"/counters").then((res) => res.json());
        },
        async fetchServicesByCounter(counterId: number): Promise<Service[]> {
            return await fetch(BASE_URL+"/counters/"+counterId+"/services").then((res) => res.json());
        },
        async fetchServedTicketsByCounterGrouped(counterId: number): Promise<Record<number, Ticket[]>> {
            const tickets = await fetch(BASE_URL+"/queues/served/"+counterId).then((res) => res.json());
            const grouped: Record<string, Ticket[]> = {};
            tickets.forEach((t: Ticket) => {
                if (!grouped[t.service]) grouped[t.service] = [];
                grouped[t.service].push(t);
            });
            return grouped;
        },
        async callNext(counterId: number): Promise<Ticket | null> {
            return await fetch(BASE_URL+"/queues/next/"+counterId, {method: 'POST'}).then((res) => {
                if (res.status === 204) return null;
                return res.json();
            });
        },
        async closeTicket(ticketId: number): Promise<void> {
            await fetch(BASE_URL+"/queues/"+ticketId+"/close", {method: 'POST'});
        }
    };
})();

/**
 * UI
 */
function OfficerPanel() {
    const [counters, setCounters] = useState<Counter[]>([]);
    const [selectedCounterId, setSelectedCounterId] = useState<number | "">("");
    const [services, setServices] = useState<Service[]>([]);
    const [servedByService, setServedByService] = useState<Record<string, Ticket[]>>({});
    const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);

    const [loading, setLoading] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        API.fetchCounters()
            .then((res) => mounted && setCounters(res))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedCounterId) {
            setServices([]);
            setServedByService({});
            setCurrentTicket(null);
            return;
        }
        let mounted = true;
        setLoading(true);
        Promise.all([
            API.fetchServicesByCounter(selectedCounterId as number),
            API.fetchServedTicketsByCounterGrouped(selectedCounterId as number),
        ])
            .then(([srv, grouped]) => {
                if (!mounted) return;
                setServices(srv);
                setServedByService(grouped);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
        return () => {
            mounted = false;
        };
    }, [selectedCounterId]);

    const onCallNext = async () => {
        if (!selectedCounterId || currentTicket) return;
        setLoadingNext(true);
        setError(null);
        try {
            const t = await API.callNext(selectedCounterId as number);
            if (!t) {
                setError("Nessun cliente in attesa per questo counter.");
            }
            setCurrentTicket(t ?? null);
        } catch (e: any) {
            setError(e.message ?? "Errore durante la chiamata del prossimo cliente.");
        } finally {
            setLoadingNext(false);
        }
    };

    const finalizeTicket = async () => {
        if (!currentTicket) return;
        setLoadingNext(true)
        try {
            await API.closeTicket(currentTicket.id);
            setCurrentTicket(null);
            // Refresh served tickets
            if (selectedCounterId) {
                API.fetchServedTicketsByCounterGrouped(selectedCounterId as number)
                    .then((grouped) => setServedByService(grouped))
                    .catch((e) => setError(e.message));
            }
        } catch (e: any) {
            setError(e.message ?? "Errore durante la finalizzazione del ticket.");
        } finally {
            setLoadingNext(false)
        }
    }
    const servicesWithServed = useMemo(() => {
        return services.map((s) => ({
            ...s,
            served: servedByService[s.name] ?? [],
        }));
    }, [services, servedByService]);

    return (
        <Container fluid className="py-4">
            <Row className="mb-3">
                <Col md={8}>
                    <h2>Officer Panel</h2>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="counterSelect">
                        <Form.Label>Seleziona il counter</Form.Label>
                        <Form.Select
                            value={selectedCounterId}
                            onChange={(e) => setSelectedCounterId(e.target.value ? Number(e.target.value) : "")}
                            disabled={loading || loadingNext}
                        >
                            <option value="">-- Seleziona --</option>
                            {counters.map((c) => (
                                <option key={c.counter_code} value={c.counter_code}>
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
                            <span>Azione</span>
                            {loading && (
                                <span>
                  <Spinner size="sm" animation="border" /> Caricamento
                </span>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex gap-2 align-items-center">
                                <Button
                                    variant="primary"
                                    onClick={onCallNext}
                                    disabled={!selectedCounterId || !!currentTicket || loadingNext}
                                >
                                    {loadingNext ? (
                                        <>
                                            <Spinner size="sm" animation="border" className="me-2" /> Chiamata...
                                        </>
                                    ) : (
                                        "Chiama prossimo cliente"
                                    )}
                                </Button>
                            </div>

                            {currentTicket && (
                                <Card className="mt-3">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold">
                                                Ticket: <Badge bg="secondary">{currentTicket.number}</Badge>
                                            </div>
                                            <div className="text-muted">
                                                Servizio: {currentTicket.service}
                                                (<Badge bg="info">
                                                {currentTicket.service}
                                            </Badge>)
                                            </div>
                                            <div className="text-muted">Stato: {currentTicket.served ? "SERVED" : "SKIPPED"}</div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => finalizeTicket()}
                                                disabled={loadingNext}
                                            >
                                                Skipped
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            )}

                            {!currentTicket && <div className="text-muted mt-3">Nessun ticket chiamato.</div>}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header>Storico ticket serviti per servizio</Card.Header>
                        <Card.Body>
                            {!selectedCounterId && <div className="text-muted">Seleziona un counter per visualizzare i dati.</div>}
                            {selectedCounterId && servicesWithServed.length === 0 && !loading && (
                                <div className="text-muted">Nessun servizio disponibile per questo counter.</div>
                            )}
                            {selectedCounterId && (
                                <Accordion alwaysOpen>
                                    {servicesWithServed.map((s) => (
                                        <Accordion.Item eventKey={String(s.name)} key={s.name}>
                                            <Accordion.Header>
                                                {s.name}
                                                <Badge bg="secondary" className="ms-2">
                                                    {s.served.length}
                                                </Badge>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {s.served.length === 0 ? (
                                                    <div className="text-muted">Nessun ticket servito per questo servizio.</div>
                                                ) : (
                                                    <ListGroup variant="flush">
                                                        {s.served.map((t) => (
                                                            <ListGroup.Item key={t.id} className="d-flex justify-content-between">
                                <span>
                                  <Badge bg="dark" className="me-2">
                                    {t.number}
                                  </Badge>
                                  Servito il{" "}
                                    {t.servedAt
                                        ? new Date(t.servedAt).toLocaleString()
                                        : "-"}
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
