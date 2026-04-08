import express from 'express';
import {rentMovie,getMyRentals} from '../controllers/rentalController.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/me',verifyToken, getMyRentals);
router.post('/:movieId',verifyToken, rentMovie);
export default router;
