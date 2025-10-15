import {Router} from "express";
import {getAllQueues, getQueueByService, nextCustomer} from "@controllers/queueController";

const router = Router({mergeParams:true});

router.get('/', (req, res) => {
    try {
        const result = getAllQueues();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send('Error retrieving queues');
    }
});


router.get('/:serviceId', (req, res) => {
    try {
        const serviceId = parseInt(req.params.serviceId);
        const result = getQueueByService(serviceId);
        res.send(result);
    } catch (error) {
        res.status(500).send('Error retrieving queue');
    }
});

router.post('/next/:counterId', (req, res) => {
    try {
        const counterId = parseInt(req.params.counterId);
        const result = nextCustomer(counterId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(204).send(); // No Content
        }
    } catch (error) {
        res.status(500).send('Error processing next customer');
    }
});






export default router;
