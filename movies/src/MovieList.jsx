import React from 'react';
import MovieCard from './MovieCard';

const MovieList = (props) => {
  return (
  <>
<div className ='Card-titl  font-size: 1em;
    color: #555;
    margin: 8px 0;'>{props.title}</div>


    </>
  )
}

export default MovieList