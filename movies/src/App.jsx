import React from 'react';
import logo from './logo.svg';
import MovieCard from './MovieCard.jsx';
import MovieList from './MovieList.jsx';

function App() {
  
  return (
   <>
   <MovieCard films= {[]} title = {['film1', 'film2', 'film3' ]} Description = {['This film is Amasing','This film is Cool','This film is good']}
   Rating = {[60,55,50]}
   
   />
   <MovieList title = {['film1', 'film2', 'film3' ]} />
   
   </>
  );
}

export default App;
