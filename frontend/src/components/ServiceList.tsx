import { Button, Card, ListGroup, Container} from "react-bootstrap";
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">
                    {services.map((service) => (
                        <ListGroup.Item 
                            key={service.id}
                            className="d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                // Example: use the first customer in the list, or handle if no customers exist
                                if (customers.length > 0) {
                                    createTicket(service.id);
                                } else {
                                    alert('No customers available');
                                }
                            }}>
                            <div>
                                {service.name}
                                {service.description && (
                                    <small className="d-block text-muted">
                                        {service.description}
                                    </small>
                                )}
                            </div>
                            <Button variant="primary" size="sm">
                                Get Ticket
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>

            {selectedTicket && (
                <Card className="mt-3" style={{ width: '18rem' }}>
                    <Card.Header>Your Ticket</Card.Header>
                    <Card.Body>
                        <Card.Title>Ticket #{selectedTicket.id}</Card.Title>
                        <Card.Text>
                            Service: {selectedTicket.service.name}<br/>
                        </Card.Text>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default SList;