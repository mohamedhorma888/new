import mongoose from 'mongoose';
import colors from 'colors';
const movieschema = new mongoose.Schema({ 
    title : {
        type: String,
        required: true ,
    },
    description : {
        type: String,
        required: true,
    },
    releaseDate : {
        type: Date,
        required: true,
    } ,

price : {
    type: Number,
    required : true,
    trim : true,
},

genre : { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },



},{timestamps: true,});


const Movie = mongoose.model('Movie', movieschema);
export default Movie;


