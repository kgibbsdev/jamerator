import { Component, OnInit } from '@angular/core';
import { Words } from '../words';

@Component({
  selector: 'app-jamgen',
  templateUrl: './jamgen.component.html',
  styleUrls: ['./jamgen.component.css']
})
export class JamgenComponent implements OnInit {

  words: string[] = Words;
  sentence: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.addWord(3);
  }

  randomIndex() {
    let randomIndex = Math.floor(Math.random() * (this.words.length - 1));
    console.log('randomIndex', randomIndex);
    return randomIndex;
  }

  addWord(timesToRepeat: number = 1): void {
    if (this.words.length > 0) {
      let chosenIndex = this.randomIndex();
      let chosenWord;

      for (let i = 0; i < timesToRepeat; i++) {
        chosenWord = this.words[chosenIndex];
        this.words.splice(chosenIndex, 1);
        this.sentence = [...this.sentence, chosenWord];
      }
    }
  }

  rerollWord(indexToReplace: number) {
    let newIndex = this.randomIndex();
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




}
