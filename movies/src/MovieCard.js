import React from 'react';
import film1 from './assets/film1.jpg'
import film2 from './assets/film2.jpg'
import film3 from './assets/film3.jpg'
import { Link } from 'react-router-dom';


const MovieCard = (props) => {
  return (
    <>
    <h1>Hello</h1> 
    <div className = 'MovieCard'>
    <img className ='MovieCard-image' src={film1} alt="Profile Picture1" />
    <h2 className = 'Card-title'>{props.title[0]}</h2>
    <p className ='Card-text'>{props.Description[0]}</p>
    <span className ='Card-ratig'>{props.Rating[0]}</span>
</div>
<div className = 'MovieCard'>
    <img className ='MovieCard-image' src={film2} alt="Profile Picture2" />
    <h2 className ='Card-title'>{props.title[1]}</h2>
    <p className ='Card-text'>{props.Description[1]}</p>
    <span className = 'Card-rating'>{props.Rating[1]}</span>
</div>
<div className = 'MovieCard'>
    <img className ='MovieCard-image' src={film3} alt="Profile Picture3" />
    <h2 className ='Card-title'>{props.title[2]}</h2>
    <p className = 'Card-text'>{props.Description[2]}</p>
    <span className ='Card-rating'>{props.Rating[2]}</span>
</div>
    </>
  
  )
}

export default MovieCard