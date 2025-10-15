import {Router} from "express";
import {createCounter, getAllCounters, getAllServicesByCounter, getCounterById} from "@controllers/counterController";
import * as console from "node:console";

const router = Router({mergeParams:true});

router.get('/', async (req, res, next) => {
    try {
        const result = await getAllCounters();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await getCounterById(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

router.get('/:id/services', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await getAllServicesByCounter(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const result = await createCounter(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
})

export default router;