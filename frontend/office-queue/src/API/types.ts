export type Counter = {
    counter_code: number,
    service_codes: number[]
};

export type Service = {
    name: string;
    description?: string;
};

export type Ticket = {
    id: number;
    number: string;
    service: string;
    createdAt: string;
    served: boolean;
    servedAt?: string;
    closedAt?: string;
};