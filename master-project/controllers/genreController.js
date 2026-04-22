import { response } from "express";
import Genre from "../models/genre.js";
import { validateGenre } from "../utils/validate.js";

export const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGenreById = async (req, res) => {
   try {
    const { id } = req.params;
    const genre = await Genre.findById(id);
    if(!genre) {
        return response.status(404).json({ message: "Genre with ${id} not found" });
    }
    res.status(200).json(genre);
   }
catch (error) {
    res.status(500).json({ message: error.message });
}
};


export const createGenre = async (req, res) => {
    try {
     
        const { error } = validateGenre(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let genre =  new Genre(req.body);
        genre = await genre.save();
        res.status(201).json(genre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = validateGenre(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const genre = await Genre.findByIdAndUpdate(id, req.body, { new: true });
        if (!genre) {
            return res.status(404).json({ message: `Genre with ${id} not found` });
        }
        res.status(200).json(genre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};