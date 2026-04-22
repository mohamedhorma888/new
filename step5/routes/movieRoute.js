import express from "express";
import { getAllMovies, createMovie, updateMovie, deleteMovie } from "../controllers/movieController.js";
import {verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();
// Get all movies /api/movies
router.get("/", getAllMovies);
// Create a new movie /api/movies
router.post("/",verifyToken, isAdmin, createMovie);

// Update a movie /api/movies/:id
router.put("/:id",verifyToken,isAdmin, updateMovie);
// Delete a movie /api/movies/:id
router.delete("/:id",verifyToken,isAdmin, deleteMovie);




export default router;
