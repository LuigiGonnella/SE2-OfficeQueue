import {Col, Row, Button, Card, ListGroup, Container, Form} from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { api } from "../services/apiService.ts";
import React, { useState, useEffect } from 'react';
import type { Customer } from "../API/api.ts";

function CustomerCreation() {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
        firstName: '',
        lastName: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const customerData = {
            id: Math.floor(Math.random() * 1000), // Temporary ID generation
            firstName: formData.firstName,
            lastName: formData.lastName,
        };

        console.log('Sending customer data:', customerData);
        const response = await api.customersPost(customerData);
        console.log('Response:', response);

        setFormData({ firstName: '', lastName: '' });
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
                <Card.Header>Create New Customer</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Customer Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Create Customer
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CustomerCreation;