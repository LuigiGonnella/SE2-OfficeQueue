import {Col, Row, Button, Card, ListGroup, Container, Form} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from "../services/apiService.ts";
import React, { useState, useEffect } from 'react';
import type { Service } from "../API/api.ts";

function ServiceCreation() {
    const [formData, setFormData] = useState<Omit<Service, 'id'>>({
        name: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.servicesPost({
                id: 0,
                ...formData
            });
            // Reset form after successful creation
            setFormData({ name: '', description: '' });
        } catch (err) {
            console.error('Error creating service:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>Create New Service</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Create Service
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ServiceCreation;