export interface WordQuery {
    meansLike?: string;
    soundsLike?: string;
    spelledLike?: string;
    leftContext?: string;
    rightContext?: string;
    partsOfSpeech?: Array<PartsOfSpeech>;
    numberOfSyllables?: number;
    maxResultsToReturn?: number;
}

export interface WordResult {
    word: string;
    score: number;
    tags: Array<string>;
    numSyllables: number;
}

export enum PartsOfSpeech {
    Noun,
    Verb,
    Adjective,
    Adverbs
}