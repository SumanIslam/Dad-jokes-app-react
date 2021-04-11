import React, { Component } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./JokeList.css";
import Joke from "./Joke";

export default class JokeList extends Component {
  static defaultProps = {
    numOfGetJokes: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };
    this.handleVotes = this.handleVotes.bind(this);
  }
  async componentDidMount() {
    let newJokes = [];
    while (newJokes.length < this.props.numOfGetJokes) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      newJokes.push({ text: res.data.joke, votes: 0, id: uuidv4() });
    }

    this.setState({ jokes: newJokes });

    console.log(newJokes);
  }
  handleVotes(id, alpha) {
    this.setState((st) => ({
      jokes: st.jokes.map((j) => 
        j.id === id ? { ...j, votes: j.votes + alpha } : j
      )
    }));
  }
  render() {
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="Laughing imogi"
          />
          <button className="Jokes-btn">New Jokes</button>
        </div>

        <div className="JokeList-jokes">
          {this.state.jokes.map((j) => (
            <Joke
              key={j.id}
              text={j.text}
              votes={j.votes}
              upVote={() => this.handleVotes(j.id, 1)}
              downVote={() => this.handleVotes(j.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}
