import lexicon from './lexicon.json';

const consonantsList = Object.keys(lexicon.consonants).sort((a, b) => b.length - a.length);
const vowelsList = Object.keys(lexicon.vowels).sort((a, b) => b.length - a.length);
const punctuationsList = Object.keys(lexicon.punctuations || {}).sort((a, b) => b.length - a.length);

// Reverse mappings for Javanese to Latin
const reverseConsonants = {};
Object.entries(lexicon.consonants).forEach(([k, v]) => {
    if (!reverseConsonants[v] || k.length < reverseConsonants[v].length) {
        reverseConsonants[v] = k;
    }
});

const reverseVowels = {};
Object.entries(lexicon.vowels).forEach(([k, v]) => {
    if (v !== "") {
        reverseVowels[v] = k;
    }
});

const reverseFinals = {};
Object.entries(lexicon.final).forEach(([k, v]) => {
    reverseFinals[v] = k;
});

const reversePunctuations = {};
Object.entries(lexicon.punctuations).forEach(([k, v]) => {
    reversePunctuations[v] = k;
});

const javUnits = [
    ...Object.keys(reverseConsonants),
    ...Object.keys(reverseVowels),
    ...Object.keys(reverseFinals),
    ...Object.keys(reversePunctuations),
    lexicon.pangkon
].sort((a, b) => b.length - a.length);

export function transl(input) {
    // ... existing transl logic ...
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

export function reverseTransl(input) {
    if (!input) return "";
    let output = "";
    let i = 0;

    while (i < input.length) {
        let char = input[i];

        if (/\s/.test(char)) {
            output += " ";
            i++;
            continue;
        }

        let matchedUnit = null;
        for (const unit of javUnits) {
            if (input.startsWith(unit, i)) {
                matchedUnit = unit;
                break;
            }
        }

        if (matchedUnit) {
            if (reverseConsonants[matchedUnit]) {
                let latinConsonant = reverseConsonants[matchedUnit];
                let nextIndex = i + matchedUnit.length;
                
                // Check if next is a vowel or pangkon
                let matchedVowel = null;
                for (const v of Object.keys(reverseVowels)) {
                    if (input.startsWith(v, nextIndex)) {
                        matchedVowel = v;
                        break;
                    }
                }

                if (matchedVowel) {
                    output += latinConsonant + reverseVowels[matchedVowel];
                    i = nextIndex + matchedVowel.length;
                } else if (input.startsWith(lexicon.pangkon, nextIndex)) {
                    output += latinConsonant;
                    i = nextIndex + lexicon.pangkon.length;
                } else {
                    // Inherent 'a'
                    output += latinConsonant + "a";
                    i = nextIndex;
                }
            } else if (reverseVowels[matchedUnit]) {
                // Standalone vowel (usually starts with 'h' in Javanese)
                output += reverseVowels[matchedUnit];
                i += matchedUnit.length;
            } else if (reverseFinals[matchedUnit]) {
                output += reverseFinals[matchedUnit];
                i += matchedUnit.length;
            } else if (reversePunctuations[matchedUnit]) {
                output += reversePunctuations[matchedUnit];
                i += matchedUnit.length;
            } else if (matchedUnit === lexicon.pangkon) {
                // Should be handled by consonant logic, but just in case
                i += matchedUnit.length;
            } else {
                output += char;
                i++;
            }
        } else {
            output += char;
            i++;
        }
    }
    return output;
}
