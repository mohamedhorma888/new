import express from 'express';
import {rentMovie,getMyRentals, updateRental, deleteRental} from '../controllers/rentalController.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

router.get('/me',verifyToken, getMyRentals);
router.post('/:movieId',verifyToken, rentMovie);
router.put('/:rentalId', verifyToken, updateRental);
router.delete('/:rentalId', verifyToken, deleteRental);

export default router;
