import React, { Component } from 'react';
import Logo from '/src/logo.svg';
import Results from '/src/components/results';
import { requestData } from '/src/client/client';
import { languages } from '/src/utility/constants';
import './Dictionary.css';

import _ from 'underscore';

class Dictionary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      pronounciations: [],
      language: languages[0],
    };
  }

  handleClick = () => {
    this.submitRequest();
  };

  handleChange = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  handleLanguageChange = (event) => {
    this.setState({
      language: event.target.value,
    });
  };

  handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      this.submitRequest();
    }
  };

  submitRequest = () => {
    const { input, language } = this.state
    if (input === '') {
      this.setState({ requested: input, pronounciations: [] });
    }
    requestData(input, language).then((results, err) => {
      if (err != null) {
        console.error('got error from chinese to pinyin', err);
      }
      this.setState({
        requested: input, pronounciations: results.results || [], err,
      });
    }).catch((err) => {
      this.setState({
        err,
      });
    });
  }

  renderResults = () => {
    const { pronounciations, requested, err } = this.state;

    return (
      <Results
        pronounciations={pronounciations}
        input={requested}
        err={err}
      />
    )
  }

  renderLanguages = () => {
    const { language } = this.state;

    return (
      <select style={{ height: '36px', border: '1px solid #eeeeee'}} onChange={this.handleLanguageChange} defaultValue={language}>
        {languages.map(lang => <option key={lang} value={lang} label={lang} />)}
      </select>
    );
  }

  render() {
    return (
      <div className="container">
        <div style={{ padding: '20px 20px 20px 20px', borderBottom: '1px solid #bbb', display: 'flex' }}>
          <input style={{ width: '100%', fontSize: '22px', padding: '3px', boxSizing: 'border-box', color: '#444444', marginRight: '5px' }} type="name" onKeyPress={this.handleKeyUp} onChange={this.handleChange}/>
          <button onClick={this.handleClick} style={{ backgroundColor: '#fafafa', border: '1px solid #999', padding: '5px', marginRight: '5px' }}>Submit</button>
          {this.renderLanguages()}
        </div>
        <div className="bottom" style={{ paddingTop: '10px', backgroundColor: '#FBFBFB' }}>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default Dictionary;
