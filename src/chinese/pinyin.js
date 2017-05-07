///Primary Function.
function pinyinize(str){
  return pinyinizeWordWithNumber(str,true);
}

var diacriticsA = ['Ā','Á','Ǎ','À','A'];
var diacriticsE = ['Ē','É','Ě','È','E'];
var diacriticsO = ['Ō','Ó','Ǒ','Ò','O'];
var diacriticsI = ['Ī','Í','Ǐ','Ì','I'];
var diacriticsU = ['Ū','Ú','Ǔ','Ù','U'];
var diacriticsV = ['Ǖ','Ǘ','Ǚ','Ǜ','Ü'];

var diacriticsa = ['ā','á','ǎ','à','a'];
var diacriticse = ['ē','é','ě','è','e'];
var diacriticso = ['ō','ó','ǒ','ò','o'];
var diacriticsi = ['ī','í','ǐ','ì','i'];
var diacriticsu = ['ū','ú','ǔ','ù','u'];
var diacriticsv = ['ǖ','ǘ','ǚ','ǜ','ü'];

var diacriticMap = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,diacriticsA,null,null,null,diacriticsE,null,null,null,diacriticsI,null,null,null,null,null,diacriticsO,null,null,null,null,null,diacriticsU,diacriticsV,null,null,null,null,null,null,null,null,null,null,diacriticsa,null,null,null,diacriticse,null,null,null,diacriticsi,null,null,null,null,null,diacriticso,null,null,null,null,null,diacriticsu,diacriticsv,null,null,null,null];

function isVowel(ch){
  var tmp = ch.toLowerCase();
  return (tmp == 'a' || tmp == 'e' || tmp == 'i' || tmp == 'o' || tmp == 'u');
}
function isPinyinable(ch){
  return(isVowel(ch) || ch == 'v' || ch == 'V');
}
function containsIgnoreCase(base, against){
  return (base.toLowerCase().indexOf(against) != -1);
}
function replaceCharAt(str,index,chr) {
  if(index > str.length - 1) return str;
  return str.substr(0,index) + chr + str.substr(index + 1);
}
function isnumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function isalpha(c){
  if (c.length == 0)
    return false;
  return ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
}
function pinyinizeWordWithNumber(str, extraDelmit){
  var ret = '';
  str = str.replace('u:','v');
  if (extraDelmit == true){
    var prev = 0;
    for(var a = 0; a < str.length; a++){
      if (!isalpha(str.charAt(a)) || a == str.length - 1){
        ret += pinyinizeWordWithNumber(str.substr(prev,a - prev + 1),false);
        prev = a + 1;
        a++;
      }
    }
    if (prev < str.length)
      ret += str.charAt(str.length - 1);
    return ret;
  }
  ret = str;
  //ret = str.replace('u:','v');
  var tone = 6;
  if (isnumeric(str[str.length - 1])){
    tone = parseInt(str.substr(str.length - 1,1));
    if (tone <= 5){
      ret = ret.substr(0,ret.length - 1);
    }
    else{
      return ret;
    }
  }
  return pinyinizeWord(ret,tone);
}
function pinyinizeWord(str, tone){
  var ret = str;
  var lastPinyinable = -1;
  var oPosition = -1;
  var aposition = str.indexOf('a');
  var eposition = str.indexOf('e');
  var startpos = 0;
  if (eposition >= 0){
    startpos = eposition;
  }
  else if (aposition >= 0){
    startpos = aposition;
  }

  for(var a = startpos; a < str.length; a++){
    var cchar = ret.charAt(a).toLowerCase();
    if (isPinyinable(cchar)){
      ret = replaceCharAt(ret,a,pinyinizeChar(ret.charAt(a),tone));
      return ret;
    }
    else{
      if (cchar == 'o'){
        oPosition = a;
      }
      lastPinyinable = a;
    }
  }
  if (lastPinyinable >= 0){
    if (oPosition >= 0 && containsIgnoreCase(str,'ou')){
      ret = replaceCharAt(ret,oPosition,pinyinizeChar(ret.charAt(oPosition),tone));
    }
    else{
      ret = replaceCharAt(ret,lastPinyinable,pinyinizeChar(ret.charAt(lastPinyinable),tone));

    }
    return ret;
  }
  return ret;
}
function pinyinizeChar(character, tone){
  if (character.charCodeAt(0) <= 128) {
    var code = character.charCodeAt(0);
    if (diacriticMap[code] != null){
      if (diacriticMap[code] != null && diacriticMap[code].length >= tone){
        var tmp = diacriticMap[code][tone - 1];
        return tmp;
      }
    }
  }
  return character;
}

export function fixPinyin(pinyin) {
  return pinyinize(pinyin);
}

export function fixEnglish(english) {
  const ret = english.replace(/\/(.*)\//, '$1');
  return ret.split('/');
}
