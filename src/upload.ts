import { Router } from 'express';
import bodyparser from 'body-parser';

const router = Router();

router.use(bodyparser.json());

router.put('/', (req, res) => {});

export default router;
