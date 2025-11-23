import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

class App extends React.Component {
  state = {
    Person: {
      fullName: "Mohamed Aghob",
      bio: "I am a student at GoMyCode",
      imgSrc: './zeidane.jpg',
      profession: "Student"
    },
    show: false
  };

   handleShow = () => {
    this.setState({
      ...this.state,
      show: !this.state.show
    });
  };

  render() {
   
    return (
      <>
        {  this.state.show && (
          <>
            <div>{this.state.Person.fullName}</div>
            <div>{this.state.Person.bio}</div>
            <img src= './zeidane.jpg' alt="photo"></img>
            <div>{this.state.Person.profession}</div>
            <br></br>
          </>
        )}

        <button onClick={this.handleShow}>click here</button>
      </>
    );
  }
}



export default App;
