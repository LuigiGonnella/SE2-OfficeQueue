import {Col, Row, Button, Card, ListGroup, Container} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from "../services/apiService.ts";
import React, { useState, useEffect } from 'react';
import type { Service } from "../API/api.ts";

function SList() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">
                    {services.map((service) => (
                        <ListGroup.Item key={service.id}>
                            {service.name}
                            {service.description && (
                                <small className="d-block text-muted">
                                    {service.description}
                                </small>
                            )}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
}

export default SList;