import React, { Component } from 'react';
import Logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      pronounciations: [1,2,3,4,5],
    };
  }

  handleChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  displayResults = () => {
    const { pronounciations } = this.state;

    return pronounciations.reduce((memo, item, dex) => {
      memo.push(<p key={item.id || dex}>{item.simplified + " " + item.pinyin}</p>); // format this to match pronounciation display
      return memo;
    }, []);
  }

  handleClick = () => {
    const { input } = this.state
    const results = []; // do sql call to get pronounciations
    this.setState({
      pronounciations: results,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="top">
          <input type="name" onChange={this.handleChange}/>
          <button onClick={this.handleClick}>Pronounce</button>
        </div>
        <hr/>
        <div className="bottom">
          {this.state.pronounciations ? this.displayResults() : null}
        </div>
      </div>
    );
  }
}

export default App;
