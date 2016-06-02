import {Page, NavController, NavParams} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {Parser} from '../../providers/parser';
import {Translator} from '../../providers/translator';
import {Events} from 'ionic-angular';
import {Inicio} from './../inicio/inicio';

@Page({
  templateUrl: 'build/pages/ajustes/ajustes.html',
  providers: [Parser,Translator]
})


export class Ajustes{
  tit:string;
  onlineMode: any;
  datos_moviles: string;
  idioma: string;
  translator_object: any;
  lang: {
    es:boolean,
    ca:boolean,
    eu:boolean,
    en:boolean,
    de:boolean,
    fr:boolean
  } = {
    es: true,
    ca:false,
    eu:false,
    en: false,
    de: false,
    fr: false
  };

  constructor(private nav: NavController,
     private params : NavParams,
     private parser: Parser,
     private translator: Translator,
     private _ngZone: NgZone,
     public events: Events) {

    this.params = params;
    this.tit = this.params.get('tit');
    this.onlineMode = localStorage.getItem('online');
    translator.load().then(data =>{
      this.translator_object = data;
      this.datos_moviles = data[localStorage.getItem('lang')]['DATOS_MOVILES'];
      this.idioma = data[localStorage.getItem('lang')]['SELECT_IDIOMA'];
      this.tit = data[localStorage.getItem('lang')]['TIT_AJUSTES'];
      var selectedLang = localStorage.getItem('lang');
      this.lang[selectedLang] = true;
      Object.keys(this.lang).forEach(l =>{
        if(l !== selectedLang){
          this.lang[l] = false;
        }
      });

    });

  }

  toggleClick(onlineMode){
    if(onlineMode === "true"){
      this.onlineMode = "false";
    }else{
      this.onlineMode = "true";
    }

    localStorage.setItem('online',this.onlineMode);
  }

  selectLang(lang){
    localStorage.setItem('lang',lang);
    this.lang[lang] = true;
    this._ngZone.run(() => {
      this.datos_moviles = this.translator_object[localStorage.getItem('lang')]['DATOS_MOVILES'];
      this.idioma = this.translator_object[localStorage.getItem('lang')]['SELECT_IDIOMA'];
      this.tit = this.translator_object[localStorage.getItem('lang')]['TIT_AJUSTES'];
    });
    Object.keys(this.lang).forEach(l =>{
      if(l !== lang){
        this.lang[l] = false;
      }
    });
    this.events.publish('lang:changed', lang);
  }
  
  openHome() {
    this.nav.setRoot(Inicio,{});
  }

}
