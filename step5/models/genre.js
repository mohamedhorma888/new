import mongoose from "mongoose";
import colors from "colors";
const genreschema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        unique: true,
    },
    
},{timestamps: true,});

  const Genre = mongoose.model('Genre', genreschema);
  export default Genre;




