const lexicon = require('./lexicon.json');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function transl(input) {
    var str = ` ${input}`;
    var output = "";

    const vowel = new RegExp(`[aeiou]`,'gi');
    
    for (let index = 0; index < input.length; index++) {
        const char = input[index];
        const lastletter = input[index-1];
        const nextletter = input[index+1];
        const lastvow = (lastletter && (/[aeiou]/gi.test(lastletter)));
        const lastcon = (lastletter && !(/[aeiou]/gi.test(lastletter)));
        const nextvow = (nextletter && (/[aeiou]/gi.test(nextletter)));
        const nextcon = (nextletter && !(/[aeiou]/gi.test(nextletter)));

        console.log(`${lastletter} ${lastcon}`);
        console.log(char);
        console.log(`${nextletter} ${nextvow}`);
        console.log(`${input[index+2]}`);
        console.log(`---`);
        if (`${char}${nextletter}` == 'ng' && vowel.test(input[index+2])) {
            if (!input[index+2]) output += `${lexicon.jawa.ng}`;
            else if (/a/gi.test(input[index+2])) output += `${lexicon.jawa.nga}`;
            else output += `${lexicon.jawa.nga}${lexicon.jawa[input[index+2]]}`;
            index+=2;
        }
        else if (nextvow && !(vowel.test(char))) {
            if (/a/gi.test(nextletter)) output += `${lexicon.jawa[char + "a"]}`;
            else output += `${lexicon.jawa[char + "a"]}${lexicon.jawa[nextletter]}`;
            index++;
        }
        else if ((lastvow && vowel.test(char)) || (!lastletter && vowel.test(char))) {
            if (/a/gi.test(char)) output += `${lexicon.jawa.ha}`;
            else output += `${lexicon.jawa.ha}${lexicon.jawa[nextletter]}`;
        }
        else if ((nextcon && !(vowel.test(char))) || (!nextletter && !(vowel.test(char)))) {
            output += `${lexicon.jawa[char + "a"]}${lexicon.jawa.pangkon}`;
        }
    }
    return output
    //return str.replace(/ha/gi, lexicon.ha);
}

readline.question('Input, Latin to Javanese >> ', input => {
  console.log(`${transl(input)}`);
  readline.close();
});