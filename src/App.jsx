import React, { Component } from 'react';
import Logo from './logo.svg';
import { requestData } from './client/client';
import { fixPinyin, fixEnglish } from './chinese/pinyin';
import { languages } from './utility/constants';
import './App.css';

import _ from 'underscore';

class App extends Component {
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

  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.submitRequest();
    }
  };

  submitRequest = () => {
    const { input, language } = this.state
    requestData(input, language).then((results, err) => {
      if (err != null) {
        console.error('got error from chinese to pinyin', err);
      }
      this.setState({
        pronounciations: results.results || [],
      });
    });
  }

  renderHightlightedText(text, pronounciation) {
    return text.map((item, dex) => {
      return (
      <div style={{ marginRight: '2px' }} >
        <div style={{ fontWeight: 'bold', color: '#993333' }}>
          {item}
        </div>
        <div style={{ fontWeight: 'bold', color: '#DDAAAA' }}>
          {pronounciation[dex]}
        </div>
      </div>);
    });
  }

  renderNormalText(text, pronounciation) {
    return text.map((item, dex) => {
      return (
      <div style={{ marginRight: '2px' }} >
        <div style={{ fontWeight: 'bold', color: '#333333' }}>
          {item}
        </div>
        <div style={{ fontWeight: 'bold', color: '#AAAAAA' }}>
          {pronounciation[dex]}
        </div>
      </div>);
    });
  }

  renderHighlighted(text, pronounciation, pattern, highlightedCallback, normalCallback) {
    const pro = pronounciation.split(' ');
    if (pattern.length === 0) {
      return normalCallback(text.split(''), pro);
    }
    const broken = text.split(pattern);
    var patched = broken.reduce((result, item) => result.concat([item, pattern]), []).filter(item => item !== '');
    patched.pop();

    var begin = 0;
    var pronoun = patched.map((item, dex) => {
      const ret = pro.slice(begin, begin + item.length);
      begin += item.length;
      return ret;
    });

    return patched.map((item, dex) => {
      if (item === pattern) {
        return highlightedCallback(item.split(''), pronoun[dex]);
      } else {
        return normalCallback(item.split(''), pronoun[dex]);
      }
    });
  }

  renderResultRow(item, dex, request) {
    return (
      <div key={item.id || dex} style={{ borderBottom: '1px solid #aaa', marginBottom: '5px', padding: '5px' }} className="definitionRow">
        <div style={{ display: 'flex', justifyContent: 'flex-begin', marginBottom: '5px' }}>
          {this.renderHighlighted(item.simplified, fixPinyin(item.pinyin), request, this.renderHightlightedText, this.renderNormalText)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-begin', color: '#888888', flexWrap: 'wrap' }}>
          {fixEnglish(item.english).map((item, dex) => <div key={'' + item.id + '.' + dex} className="englishRow" style={{ marginRight: '5px' }}>{item}</div>)}
        </div>
      </div>
    )
  }

  renderEmpty() {
    return (
      <div style={{ padding: '10px' }}>
        No Results
      </div>
    );
  }

  renderResults = () => {
    const { pronounciations, input } = this.state;

    if (_.isEmpty(pronounciations)) {
      return this.renderEmpty();
    }

    return pronounciations.map((item, dex) => this.renderResultRow(item, dex, input));
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
          {this.renderLanguages()}
        </div>
        <div className="bottom" style={{ paddingTop: '10px', backgroundColor: '#FBFBFB' }}>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default App;
