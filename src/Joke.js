import React, { Component } from 'react'
import './Joke.css'
export default class Joke extends Component {
  render() {
    return (
      <div className="Joke">
        <div className="Joke-btns">
          <i className="fas fa-arrow-up" onClick={this.props.upVote} />
          <span className="Jokes-votes">{this.props.votes}</span>
          <i className="fas fa-arrow-down" onClick={this.props.downVote} />
        </div>
        <div className="Joke-text">{this.props.text}</div>
      </div>
    );
  }
}
