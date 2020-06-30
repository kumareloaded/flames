import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Flames } from '../model/flames';
import { Platform, ToastController } from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';  

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  userName:string;
  partnerName:string;
  
  flagF:boolean;
  flagL:boolean;
  flagA:boolean;
  flagM:boolean;
  flagE:boolean;
  flagS:boolean;

  currentFlames: string;
  previousFlames: string;

  magicNumber: number;
  magicCharacter: string;
  relationship: string;
  imageName:string;

  flag: boolean = false;

  backButtonSubscription;

  constructor(private platform: Platform, public toastController: ToastController,
    public admob: AdMobFree) { }

  ngOnInit() { 
    this.showBanner();    
  }
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  dataChanged(x) {    
    this.flag = false;
  }

  findCompatibility() {

    if (!this.validate()) {
      this.presentToast();
    }
    else {
      this.resetState();
      this.magicNumber = this.getMagicNumber();
      this.magicCharacter = this.getMagicCharacter();
      this.showBanner();

      this.getRelationship();
      this.flag = true;
    }

  }

  resetState() {
    this.flagF = true;
    this.flagL = true;
    this.flagA = true;
    this.flagM = true;
    this.flagE = true;
    this.flagS = true;
  }

  validate(): boolean {
    var firstName = this.userName;
    var secondName = this.partnerName;

    if (firstName === undefined || secondName === undefined || firstName == "" || secondName == "") {
      return false;
    }
    else {
      return true;
    }
  }

  getRelationship() {
    switch (this.magicCharacter) {
      case "f": {
        this.relationship = "FRIENDS";        
        this.imageName = "friends.png";
        this.flagF = false;
        break;
      }
      case "l": {
        this.relationship = "LOVERS";
        this.imageName = "lovers.png";
        this.flagL = false;
        break;
      }
      case "a": {
        this.relationship = "AFFECTIONATE";
        this.imageName = "affectionate.png";
        this.flagA = false;
        break;
      }
      case "m": {
        this.relationship = "MARRIED";
        this.imageName = "married.png";
        this.flagM = false;
        break;
      }
      case "e": {
        this.relationship = "ENEMIES";
        this.imageName = "enemies.png";
        this.flagE = false;
        break;
      }
      case "s": {
        this.relationship = "SIBLINGS";
        this.imageName = "siblings.png";
        this.flagS = false;
        break;
      }
      default: {
        this.relationship = "ERROR";        
        break;
      }
    }
  }

  getMagicNumber(): number {
    // Strike out matching character from both the names

    var firstName = this.userName.replace(/\s/g, "").toLowerCase();
    var secondName = this.partnerName.replace(/\s/g, "").toLowerCase();

    var count: number = 0;

    let firstNameList = new Array<number>();
    let secondNameList = new Array<number>();

    for (var i = 0; i < firstName.length; i++) {
      inner:
      for (var j = 0; j < secondName.length; j++) {
        if ((firstName.charAt(i)) === secondName.charAt(j)) {
          if (!secondNameList.includes(j)) {
            firstNameList.push(i);
            secondNameList.push(j);
            count++;
            break inner;
          }
        }
      }
    }

    // Get the count of remaining characters
    let totalCharacters = firstName.length + secondName.length;
    let strikedCharacters = firstNameList.length + secondNameList.length;

    let remainingCharacters = totalCharacters - strikedCharacters;

    console.debug('Total number is', totalCharacters);
    console.debug('Striker number is', strikedCharacters);
    console.debug('Magic number is', remainingCharacters);

    return remainingCharacters;
  }

  getMagicCharacter(): string {

    // Iterate through Flames - strike characters based on the magic number
    let _flames: string = 'flames';
    let startIndex = 0;
    let strikedList = new Array<string>();

    let holder = new Array<string>();

    for (let i = 0; i < _flames.length - 1; i++) {
      if (holder.length == 0) {
        let index: number;
        if (this.magicNumber > _flames.length) {
          index = this.magicNumber % _flames.length;
        }
        else {
          index = this.magicNumber;
        }
        let val: number;

        if (index == 0) {
          val = _flames.length - 1;
        }
        else {
          val = index - 1;
        }

        holder.push(_flames.charAt(val));
        this.previousFlames = _flames;
        this.currentFlames = _flames.replace(_flames.charAt(val), '');

        console.debug('previousFlames text is :: ', this.previousFlames);
        console.debug('currentFlames text is :: ', this.currentFlames);
      }
      else {

        let strikedWord = holder[(holder.length - 1)];

        console.debug('last striked out char', strikedWord);

        let nextIndex = this.getNextIndex(strikedWord);

        holder.push(this.currentFlames.charAt(nextIndex));
        this.previousFlames = this.currentFlames;
        this.currentFlames = this.currentFlames.replace(this.currentFlames.charAt(nextIndex), '');

        console.debug('previousFlames text is :: ', this.previousFlames);
        console.debug('currentFlames text is :: ', this.currentFlames);
      }
    }

    // Get the last character
    console.debug("The final letter is", this.currentFlames);

    return this.currentFlames;
  }

  getNextIndex(strikedWord: string): number {

    let nextInd = this.previousFlames.indexOf(strikedWord) + 1;
    console.debug('next start index from previous flames', nextInd);
    console.debug('next start index value  from previous flames', this.previousFlames.charAt(nextInd));

    nextInd = this.currentFlames.indexOf(this.previousFlames.charAt(nextInd));

    console.debug('next start index from current flames', nextInd);
    console.debug('next start index value from current flames', this.currentFlames.charAt(nextInd));

    nextInd = nextInd + this.magicNumber - 1;

    let nextValue: string;

    if (nextInd > this.currentFlames.length) {
      nextValue = this.currentFlames.charAt(nextInd % this.currentFlames.length);
    }
    else {
      nextValue = this.currentFlames.charAt(nextInd);
    }

    console.debug('next strike index from current flames', this.currentFlames.indexOf(nextValue));
    console.debug('next strike index value from current flames', nextValue);

    let nextIndex = this.currentFlames.indexOf(nextValue);

    console.debug('index of next strike character', this.currentFlames.charAt(nextIndex));
    console.debug('index of next strike character', nextIndex);

    return nextIndex;
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Enter both names!',
      duration: 2000,
      color: 'danger'      
    });
    toast.present();
  }

  showBanner() {  
      const bannerConfig: AdMobFreeBannerConfig = {            
          autoShow: true,  
         //id: Your Ad Unit ID goes here  
          id: 'ca-app-pub-6578039454067463/5217136345'  
      };  
      this.admob.banner.config(bannerConfig);  
      this.admob.banner.prepare().then(() => {  
          // success  
      }).catch(e => console.log(e));  
  }  

}
