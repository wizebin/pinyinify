import React, { Component } from 'react';
import _ from 'underscore';

import { fixPinyin, fixEnglish } from '/src/chinese/pinyin';

class Results extends Component  {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  renderHighlightedChineseText(text, pronounciation) {
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

  renderNormalChineseText(text, pronounciation) {
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

  renderHighlightedEnglishText(text) {
    return (
      <span style={{ color: '#AA5555' }}>
        {text}
      </span>
    );
  }

  renderNormalEnglishText(text) {
    return (
      <span style={{ color: '#555555' }}>
        {text}
      </span>
    );
  }

  renderHighlightedChinese(text, pronounciation, pattern, highlightedCallback, normalCallback) {
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

  renderHighlightedEnglish(text, pattern, highlightedCallback, normalCallback) {
    if (pattern.length === 0) {
      return normalCallback(text.split(''), pro);
    }
    const broken = text.split(pattern);
    var patched = broken.reduce((result, item) => result.concat([item, pattern]), []).filter(item => item !== '');
    patched.pop();

    return patched.map((item) => {
      if (item === pattern) {
        return highlightedCallback(item);
      } else {
        return normalCallback(item);
      }
    });
  }

  // fixEnglish(item.english).map((item, dex) => <div key={'' + item.id + '.' + dex} className="englishRow" style={{ marginRight: '5px' }}>{item}</div>)

  renderResultRow(item, dex, request) {
    return (
      <div key={item.id || dex} style={{ borderBottom: '1px solid #aaa', marginBottom: '5px', padding: '5px' }} className="definitionRow">
        <div style={{ display: 'flex', justifyContent: 'flex-begin', marginBottom: '5px' }}>
          {this.renderHighlightedChinese(item.simplified, fixPinyin(item.pinyin), request, this.renderHighlightedChineseText, this.renderNormalChineseText)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-begin', color: '#888888', flexWrap: 'wrap' }}>
          {fixEnglish(item.english).map((item, dex) => <div key={'' + item.id + '.' + dex} className="englishRow" style={{ marginRight: '5px' }}>{
            this.renderHighlightedEnglish(item, request, this.renderHighlightedEnglishText, this.renderNormalEnglishText)
          }</div>)}
        </div>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div style={{ padding: '10px' }}>
        No Results
      </div>
    );
  }

  renderResults(pronounciations, requested) {
    if (_.isEmpty(pronounciations)) {
      return this.renderEmpty();
    }

    return _.keys(pronounciations).map((key) => {
      if (!pronounciations || !pronounciations[key] || pronounciations[key].length == 0) {
        return undefined;
      }
      const section = (
        <div key={`section_${key}`}>
          <h2>{key}</h2>
          {pronounciations[key].map((item, dex) => this.renderResultRow(item, dex, requested))}
        </div>
      );
      return section;
    });

    // return pronounciations.map((item, dex) => this.renderResultRow(item, dex, requested));
  }

  render() {
    const { pronounciations, input, err } = this.props;
    if (err !== undefined && err != null && err != '') {
      return (
        <div style={{ padding: '10px' }}>
          {err.message || JSON.stringify(err)}
        </div>
      );
    }
    return (
      <div>
        {this.renderResults(pronounciations, input)}
      </div>
    );
  }
}

export default Results;
