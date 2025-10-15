//temporary
export type Customer = {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
};

export type Counter = {
    counter_code: number,
    service_codes: number[]
};

export type Service = {
    name: string;
    description?: string;
};

export type QueueEntry = {
    id: number;
    number: string;
    service: string;
    createdAt: string;
    served: boolean;
    servedAt?: string;
    closedAt?: string;
};

export type Ticket = {
    ticket_code: number;
    customer: Customer;
    service: Service;
}