import { Component, OnInit } from '@angular/core';
import { WordResult } from '../app.models';
import { Words } from '../words';
import { WordsApiService } from '../words-api.service';

@Component({
  selector: 'app-jamgen',
  templateUrl: './jamgen.component.html',
  styleUrls: ['./jamgen.component.css']
})
export class JamgenComponent implements OnInit {

  words: string[] = Words;
  sentence: string[] = [];

  constructor(private wordsApiService: WordsApiService) { }

  ngOnInit(): void {
    this.addWord(3);
  }

  onWordClicked(index: number, event: any) {
    if(event.shiftKey) {
      this.rerollSmart(index);
    } else {
      this.rerollWord(index);
    }
  }

  randomIndex(max: number) {
    let randomIndex = Math.floor(Math.random() * (max - 1));
    console.log('randomIndex', randomIndex);
    return randomIndex;
  }

  addWord(timesToRepeat: number = 1): void {
    if (this.words.length > 0) {
      let chosenIndex = this.randomIndex(this.words.length);
      let chosenWord;

      for (let i = 0; i < timesToRepeat; i++) {
        chosenWord = this.words[chosenIndex];
        this.words.splice(chosenIndex, 1);
        this.sentence = [...this.sentence, chosenWord];
      }
    }
  }

  rerollWord(indexToReplace: number) {
    let newIndex = this.randomIndex(this.words.length);
    let oldWord = this.sentence[indexToReplace];
    let newWord = this.words[newIndex];

    console.log(`rerolling ${oldWord} into ${newWord}`);
    console.log('this.words', this.words);
    //replace the selected word
    this.sentence[indexToReplace] = newWord;

    this.words.splice(newIndex, 1);

    //put the replaced word back into the rotation
    this.words.push(oldWord);
  }

  rerollSmart(indexToReplace: number) {
    const oldWord = this.sentence[indexToReplace];
    const wordOnLeft = indexToReplace !== 0;
    const wordOnRight = indexToReplace !== (this.sentence.length - 1);

    this.wordsApiService.getWords({
      leftContext: wordOnLeft ? this.sentence[indexToReplace - 1] : null,
      rightContext: wordOnRight ? this.sentence[indexToReplace + 1] : null,
    }).subscribe((newWordsList: Array<WordResult>) => {
      console.log("New words from API", newWordsList);

      const randomWord = newWordsList[0];
      console.log("Chosen word", randomWord);
      this.sentence[indexToReplace] = randomWord.word;
      this.words.push(oldWord);
    });
  }
}
