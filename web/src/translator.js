import lexicon from './lexicon.json';

const consonantsList = Object.keys(lexicon.consonants).sort((a, b) => b.length - a.length);
const vowelsList = Object.keys(lexicon.vowels).sort((a, b) => b.length - a.length);
const punctuationsList = Object.keys(lexicon.punctuations || {}).sort((a, b) => b.length - a.length);

export function transl(input) {
    if (!input) return "";
    let output = "";
    let i = 0;
    const lowerInput = input.toLowerCase();

    while (i < lowerInput.length) {
        let char = lowerInput[i];

        if (/\s/.test(char)) {
            output += " ";
            i++;
            continue;
        }

        let matchedPunctuation = null;
        for (const p of punctuationsList) {
            if (lowerInput.startsWith(p, i)) {
                matchedPunctuation = p;
                break;
            }
        }

        if (matchedPunctuation) {
            output += lexicon.punctuations[matchedPunctuation];
            i += matchedPunctuation.length;
            continue;
        }

        let matchedConsonant = null;
        for (const c of consonantsList) {
            if (lowerInput.startsWith(c, i)) {
                matchedConsonant = c;
                break;
            }
        }

        if (matchedConsonant) {
            let nextIndex = i + matchedConsonant.length;
            
            let matchedVowel = null;
            for (const v of vowelsList) {
                if (lowerInput.startsWith(v, nextIndex)) {
                    matchedVowel = v;
                    break;
                }
            }

            if (matchedVowel !== null) {
                output += lexicon.consonants[matchedConsonant] + lexicon.vowels[matchedVowel];
                i = nextIndex + matchedVowel.length;
            } else if (lexicon.final[matchedConsonant]) {
                output += lexicon.final[matchedConsonant];
                i = nextIndex;
            } else if (nextIndex < lowerInput.length) {
                output += lexicon.consonants[matchedConsonant] + lexicon.pangkon;
                i = nextIndex;
            } else {
                output += lexicon.consonants[matchedConsonant];
                i = nextIndex;
            }
        } else {
            let matchedVowel = null;
            for (const v of vowelsList) {
                if (lowerInput.startsWith(v, i)) {
                    matchedVowel = v;
                    break;
                }
            }

            if (matchedVowel !== null) {
                output += lexicon.consonants['h'] + lexicon.vowels[matchedVowel];
                i += matchedVowel.length;
            } else {
                output += char;
                i++;
            }
        }
    }
    return output;
}
