import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateRouter from "./generate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateRouter);

export default router;
