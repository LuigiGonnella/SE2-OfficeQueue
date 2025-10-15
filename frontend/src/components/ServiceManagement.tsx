import {Button, Card, Container, Form} from "react-bootstrap";
import { api } from "../services/apiService.ts";
import React, { useState } from 'react';
import type { Service } from "../API/api.ts";

function ServiceCreation() {
    const [formData, setFormData] = useState<Omit<Service, 'id'>>({
        name: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const serviceData = {
            id: Math.floor(Math.random() * 1000), // Temporary ID generation
            name: formData.name,
            description: formData.description,
            averageServiceTime: Math.floor(Math.random() * 1000), // Temporary ID generation
        };
        
        console.log('Sending service data:', serviceData);
        const response = await api.servicesPost(serviceData);
        console.log('Response:', response);
        
        setFormData({ name: '', description: '' });
    } catch (err: any) {
        console.error('Full error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            config: err.config
        });
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