const lexicon = require('./lexicon.json');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function transl(input) {
    var str = input;
    var output = "";
    var iterated = "";

    const vowel = new RegExp(`[aeiou]`,'gi');
    
    for (let index = 0; index < input.length; index++) {
        const char = input[index];
        const lastletter = iterated[index-1];
        let lastcon = !(vowel.test(lastletter));
        console.log(`>> ${iterated}`);
        iterated += char;

        if (/[aeiou]/gi.test(char) && !lastcon) {
            if (/a/gi.test(char)) output += lexicon.jawa.ha;
            //else if (/e/gi.test(lastletter) && /u/gi.test(char)) output = `${lexicon.jawa.ha}${lexicon.jawa.eu}`;
            else output += `${lexicon.jawa.ha}${lexicon.jawa[char]}`;
            console.log('vow');
        }
        else if (/[eiou]/gi.test(char) && lastcon) {
            var fix = lastletter + "a";
            output += `${lexicon.jawa[fix]}${lexicon.jawa[char]}`;
            console.log(`convow`);
        }
        else if (/a/gi.test(char) && lastcon) {
            var fix = lastletter + "a";
            output += lexicon.jawa[fix];
            console.log(fix);
        }
        else if (!(vowel.test(char)) && lastcon) {
            var fix = lastletter + "a";
            var xif = char + "a";
            output += `${lexicon.jawa[fix]}${lexicon.jawa.pangkon}`
        }
        else if (!lastcon) {
            var fix = char + "a";
            if (index+1 == input.length) output += `${lexicon.jawa[fix]}${lexicon.jawa.pangkon}`;
            console.log('con');
        }
        else if (/\s/gi.test(char)) output += "_ ";
    }
    return output
    //return str.replace(/ha/gi, lexicon.ha);
}

readline.question('Input, Latin to Javanese >> ', input => {
  console.log(`${transl(input)}`);
  readline.close();
});