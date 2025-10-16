import {Button, Card, ListGroup, Container, Badge, Col, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from "../services/apiService.ts";
import { useState, useEffect } from 'react';
import type { Service, Customer, Ticket } from "../API/api.ts";

function SList() {
    const [services, setServices] = useState<Service[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    useEffect(() => {
        loadServices();
        loadCustomers();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const response = await api.servicesGet();
            setServices(response.data);
        } catch (err) {
            setError('Failed to load services');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await api.customersGet();
            setCustomers(response.data);
        } catch (err) {
            console.error('Failed to load customers:', err);
            setError('Failed to load customers');
        }
    };

    const createTicket = async (serviceId: number) => {
    try {
        
        // Get the selected service
        const selectedService = services.find(s => s.id === serviceId);
        if (!selectedService) {
            throw new Error('Selected service not found');
        }

        // Get the first customer from the customers array
        if (customers.length === 0) {
            throw new Error('No customers available');
        }
        const selectedCustomer = customers[0];

        // Create new ticket object
        const ticketData = {
            service: serviceId,
            customer: selectedCustomer.id
        };

        console.log('Creating ticket with data:', ticketData);

        // Send API request to create ticket
        const response = await api.ticketsPost(ticketData);
        if (response.data) {
            setSelectedTicket(response.data);
            alert(`Ticket #${response.data.id} created successfully!`);
        }
    } catch (error) {
        console.error('Error creating ticket:', error);
        setError('Failed to create ticket');
    }
};

    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <h3 className="text-dark">Loading...</h3>
        </Container>
    );

    if (error) return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card className="border-danger border-3">
                <Card.Body className="text-center">
                    <h4 className="text-danger">Error: {error}</h4>
                </Card.Body>
            </Card>
        </Container>
    );

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
                    }
                `}
            </style>

            <Container fluid className="py-5" style={{ minHeight: '100vh' }}>
                <Row className="justify-content-center">
                    <Col lg={8} xl={6}>
                        <h1 className="text-center text-dark fw-bold mb-4 border-bottom border-primary border-3 pb-3">
                            Select a Service
                        </h1>

                        <Card className="border-dark border-2 shadow-sm mb-4">
                            <Card.Header className="bg-white border-bottom border-dark border-2">
                                <h4 className="mb-0 text-dark">Available Services</h4>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {services.map((service) => (
                                    <ListGroup.Item
                                        key={service.id}
                                        className="d-flex justify-content-between align-items-center border-bottom py-3"
                                    >
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1 text-dark fw-semibold">{service.name}</h5>
                                            {service.description && (
                                                <small className="text-secondary">
                                                    {service.description}
                                                </small>
                                            )}
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="ms-3"
                                            onClick={() => {
                                                if (customers.length > 0) {
                                                    createTicket(service.id);
                                                } else {
                                                    alert('No customers available');
                                                }
                                            }}
                                        >
                                            Get Ticket
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>

                        {selectedTicket && (
                            <Card
                                className={`border-primary border-3 shadow`}
                                style={{ backgroundColor: '#ffffff' }}
                            >
                                <Card.Header className="bg-white border-bottom border-primary border-2 text-center">
                                    <h5 className="mb-0 text-dark fw-bold">Your Ticket</h5>
                                </Card.Header>
                                <Card.Body className="text-center py-5">
                                    <Badge bg="primary" className="fs-3 px-4 py-3 mb-3">
                                        Ticket #{selectedTicket.id}
                                    </Badge>
                                    <h4 className="text-dark mt-3">Service: {selectedTicket.service.name}</h4>
                                    <p className="text-secondary mb-0">
                                        Please wait for your number to be called
                                    </p>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SList;