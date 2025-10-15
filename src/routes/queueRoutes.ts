import {Router} from "express";
import {getAllQueues, getQueueByService, nextCustomer} from "@controllers/queueController";

const router = Router({mergeParams:true});

router.get('/', async (req, res, next) => {
    try {
        const result = await getAllQueues();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


router.get('/:serviceId', async (req, res, next) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        const result = await getQueueByService(serviceId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/next/:counterId', async (req, res, next) => {
    try {
        const counterId = parseInt(req.params.counterId);
        const result = await nextCustomer(counterId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(204).send(); // No Content
        }
    } catch (error) {
        next(error);
    }
});






export default router;
