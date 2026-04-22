import express from "express";
import { getAllGenres, getGenreById, createGenre, updateGenre } from "../controllers/genreController.js";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
const router = express.Router();

router.get('/', getAllGenres);
router.get('/:id', getGenreById);
router.post('/',verifyToken, isAdmin, createGenre);
router.put('/:id',verifyToken,isAdmin, updateGenre);

export default router;



