import { Router } from "express";
import { getBoardCurrent, getBoardQueues, streamBoard } from "@controllers/boardController";

const router = Router();

router.get("/current", getBoardCurrent);
router.get("/queues", getBoardQueues);
router.get("/stream", streamBoard);

export default router;