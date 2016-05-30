import {Page, NavController, NavParams,Alert,Loading} from 'ionic-angular';
import {NgZone} from 'angular2/core';
import {Parser} from '../../providers/parser';
import {Translator} from '../../providers/translator';
import {InAppBrowser} from 'ionic-native';

@Page({
  templateUrl: 'build/pages/tiempo/tiempo.html',
  providers: [Parser]
})
export class Tiempo {
    tit: string;
    idx = 0;
    constructor(private nav: NavController, private params : NavParams, private parser: Parser,private zone: NgZone,private translator: Translator) {
      
      translator.load().then(data =>{


      });

      this.params = params;

        this.tit = "Vélez-Málaga";

    }

    openMarket(src){
      InAppBrowser.open(src,'_system','location=yes');
      console.log("hola");
    }
}
