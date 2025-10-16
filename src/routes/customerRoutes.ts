import { Router } from "express";
import { CustomerFromJSON } from "@models/dto/Customer";
import {
    getAllCustomers,
    createCustomer
} from "@controllers/customerController";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await getAllCustomers();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post( "/", async (req, res, next) => {
    try {
        await createCustomer(CustomerFromJSON(req.body));
        res.status(201).send();
    } catch (error) {
        next(error);
    }
});

export default router;