import {Router} from "express";
import {
    closeQueueEntry,
    getAllQueues,
    getQueueByService,
    getServedByCounter,
    nextCustomer, 
    getLastSixCustomer
} from "@controllers/queueController";

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

router.get('/served/:counterId', async (req, res, next) => {
    try {
        const counterId = parseInt(req.params.counterId);
        const served = await getServedByCounter(counterId);
        const result = served.map((entry) => {
            return {
                id: entry.id,
                number: entry.ticket.ticket_code,
                service: entry.ticket.service.name,
                createdAt: entry.timestamp!.toISOString(),
                served: entry.served,
                servedAt: entry.served_at ? entry.served_at.toISOString() : undefined,
                closedAt: entry.closed_at ? entry.closed_at.toISOString() : undefined,
            }
        })
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

router.post('/:ticket_id/close', async (req, res, next) => {
    try {
        const ticket_id = parseInt(req.params.ticket_id);
        await closeQueueEntry(ticket_id);
        res.status(200).send(); // OK
    } catch (error) {
        next(error);
    }
})

router.get('/recent-calls', async (req, res, next) => {
    try {
        const calls = await getLastSixCustomer();
        const result = calls.map((entry) => {
            return {
                number: entry.ticket.ticket_code,
                service: entry.ticket.service.name,
                createdAt: entry.timestamp!.toISOString(),
                counter: entry.counter?.id
            }
        })
        res.status(200).json(result);
   } catch (error) {
        next(error)
   }
})



export default router;
