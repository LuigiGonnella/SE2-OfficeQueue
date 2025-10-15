import { Router } from "express";
import { ServiceFromJSON } from "@models/dto/Service";
import {
    getAllServices,
    getServiceById,
    getServiceByName,
    createService,
    deleteService,
} from "@controllers/serviceController";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const result = await getAllServices();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/id/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await getServiceById(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/name/:name", async (req, res, next) => {
    try {
        const result = await getServiceByName(req.params.name);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post( "/", async (req, res, next) => {
    try {
        await createService(ServiceFromJSON(req.body));
        res.status(201).send();
    } catch (error) {
        next(error);
    }
});

router.delete("/name/:name", async (req, res, next) => {
    try {
        await deleteService(req.params.name);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;