import Joi from "joi";

const movieSchema = Joi.object({
   title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    releaseDate: Joi.date().required(),
    price: Joi.number().positive().required(),
    genre: Joi.string().required(),
});

const genreSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
});


export function validateUser(user) {
    return movieSchema.validate(user);
}

export function validateGenre(genre) {
    return genreSchema.validate(genre);
}
