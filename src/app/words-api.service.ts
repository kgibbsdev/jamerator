import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PartsOfSpeech, WordQuery, WordResult } from './app.models';

@Injectable({
  providedIn: 'root'
})
export class WordsApiService {

  constructor(private http: HttpClient) { }

  getWordsMeansLike(word: string) {
    return this.http.get<WordResult[]>(`https://api.datamuse.com/words?ml=${word}`)
      .pipe(map(wordsList => wordsList.filter(wordResult => wordResult.word.indexOf(" ") === -1).sort((a, b) => a.score - b.score)));
  }


  getWords(metaData: WordQuery) {
    const queryString = this.getQueryStringFromMetaData(metaData);
    return this.processWordResults(metaData, this.http.get<WordResult[]>(`https://api.datamuse.com/words${queryString}`));
  }

  private processWordResults(metaData: WordQuery, wordResults: Observable<WordResult[]>): Observable<WordResult[]> {
    return wordResults.pipe(
      map((res) => {
        if (metaData.numberOfSyllables) {
          res = res.filter((val: WordResult) => val.numSyllables === metaData.numberOfSyllables);
        }

        if (metaData.partsOfSpeech && metaData.partsOfSpeech.length > 0) {
          const partsOfSpeech: Array<string> = [];
          metaData.partsOfSpeech.map(p => {
            switch (p) {
              case PartsOfSpeech.Adjective:
                partsOfSpeech.push("adj");
                break;
              case PartsOfSpeech.Adverbs:
                partsOfSpeech.push("adv");
                break;
              case PartsOfSpeech.Noun:
                partsOfSpeech.push("n");
                break;
              case PartsOfSpeech.Verb:
                partsOfSpeech.push("v");
                break;
              default:
                break;
            }
          });

          res = res.filter((val: WordResult) => val.tags.some(r => partsOfSpeech.includes(r)));
        }

        return res;
      })
    );
  }

  private getQueryStringFromMetaData(metaData: WordQuery): string {
    let queryString = "";
    let queryCount = 0;

    const metaDataToQueryString = (metaKey, metaValue): string | null => {
      switch (metaKey) {
        case "meansLike":
          return `ml=${metaValue}`;
        case "soundsLike":
          return `sl=${metaValue}`;
        case "spelledLike":
          return `sp=${metaValue}`;
        case "leftContext":
          return `lc=${metaValue}`;
        case "rightContext":
          return `rc=${metaValue}`;
        case "maxResultsToReturn":
          return `max=${metaValue}`;
        default:
          return null;
      }
    };

    Object.keys(metaData).map((metaKey: string) => {
      const metaVal = metaData[metaKey];

      if (metaVal) {
        const parameter = metaDataToQueryString(metaKey, metaVal);
        if (parameter !== null) {
          if (queryCount === 0) {
            // First query parameter
            queryString += `?${parameter}`;
          } else {
            queryString += `&${parameter}`;
          }

          queryCount++;
        }
      }
    });

    queryString += (queryCount === 0) ? "?md=p,s" : "&md=p,s";

    return queryString;
  }

}
