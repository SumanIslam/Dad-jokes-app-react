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
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false,
    };
    this.seenJokes = new Set(this.state.jokes.map((j) => j.text));
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.setState({ loading: true });
      this.getJokes();
    }
  }
  async getJokes() {
    try {
      let newJokes = [];
      while (newJokes.length < this.props.numOfGetJokes) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        let joke = res.data.joke;
        if (!this.seenJokes.has(joke)) {
          newJokes.push({ text: joke, votes: 0, id: uuidv4() });
        }
      }

      this.setState(
        (st) => ({
          loading: false,
          jokes: [...st.jokes, ...newJokes],
        }),
        () => {
          window.localStorage.setItem(
            "jokes",
            JSON.stringify(this.state.jokes)
          );
        }
      );

      console.log(newJokes);
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }
  }
  handleVotes(id, alpha) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + alpha } : j
        ),
      }),
      () => {
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
      }
    );
  }

  handleClick() {
    this.setState({ loading: true });
    this.getJokes();
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-laugh fa-8x fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      );
    }
    let sortedJokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
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
          <button className="Jokes-btn" onClick={this.handleClick}>
            New Jokes
          </button>
        </div>

        <div className="JokeList-jokes">
          {sortedJokes.map((j) => (
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
