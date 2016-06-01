import {Page, IonicApp, Platform,NavController,Loading} from 'ionic-angular';
import {Http} from '@angular/http';
import {Lista} from '../lista/lista';
import {Parser} from '../../providers/parser';
import {Ajustes} from '../ajustes/ajustes';
import {Translator} from '../../providers/translator';
import {NgZone, Component,ViewChild} from '@angular/core';
import {Events} from 'ionic-angular';
import {Tiempo} from '../tiempo/tiempo';
import {Banderas} from '../../providers/banderas';

@Page({
  templateUrl: 'build/pages/inicio/inicio.html',
  providers: [Parser,Translator,Banderas]
  
})

export class Inicio {

  pages: Array<{idx: number,title: string,section: string,importance: number,img: string, component: any}>
  data: any;
  translator_object : string;
  importancia1: any[];
  importancia2: any[];
  importancia3: any[];
  menu_title: string;
  ajustes: string;
  inicio: string;
  tiempo : string;
  estados: any;
  constructor(private app: IonicApp,
    private platform: Platform,
    private http: Http,
    private parser: Parser,
    private banderas : Banderas,
    private translator: Translator,
    private _ngZone: NgZone,
    public events: Events,
    private nav: NavController) {



      let loading = Loading.create({content:""});
      this.nav && this.nav.present(loading);

    if(!localStorage.getItem('lang')){
      localStorage.setItem('lang','es');
    }

    this.estados = JSON.parse(localStorage.getItem('banderas'));
    this.estados = this.estados && this.estados.playas;


    parser.load(); // Download JSON data
    banderas.getEstados().then(estados =>{
      this.estados =estados;
    });
    translator.load().then(data =>{
      this.ajustes = data[localStorage.getItem('lang')]['TIT_AJUSTES'];
      this.tiempo = data[localStorage.getItem('lang')]['TIEMPO'];
      console.log(this.ajustes);
      this.translator_object = data;

      this.pages = new Array();
      this.importancia1 = new Array();
      this.importancia2 = new Array();
      this.importancia3 = new Array();

      this.parser.getTypeItems().then(typeItems => {
        this.insertTypeItems(typeItems,loading);

      }).catch(err =>{
          this.insertTypeItems(localStorage.getItem('data'),loading);
      });

    });


    events.subscribe('lang:changed', (lang) => {
      this.ajustes = this.translator_object[lang[0]]['TIT_AJUSTES'];
      this.tiempo =  this.translator_object[lang[0]]['TIEMPO'];
      console.log(this.ajustes);
      this.pages = new Array();
      this.importancia1 = new Array();
      this.importancia2 = new Array();
      this.importancia3 = new Array();
      this.parser.getTypeItems().then(typeItems => {
        var i = 0;
        typeItems.forEach(typeItem => {
          this.pages.push({ idx: i,
                            title: typeItem[lang[0]] || typeItem.type,
                            section: typeItem.type,
                            importance: typeItem.importance,
                            img: typeItem.backgroundImage,
                            component: Lista });
                            console.log(this.pages);
          i++;
        });
        for (var _i = 0; _i < this.pages.length; _i++) {
          if(this.pages[_i].importance === 1){
            this.importancia1.push(new Array(this.pages[_i]));

          }else if(this.pages[_i].importance === 2){
            this.importancia2.push([this.pages[_i],this.pages[_i+1]]);
            _i = _i + 1;
          }else{
            this.importancia3.push([this.pages[_i],this.pages[_i+1],this.pages[_i+2]]);
            _i = _i + 2;
          }

        }
      });
    });

  }
  insertTypeItems(typeItems,loading){
    var i = 0;
    typeItems.forEach(typeItem => {
      this.pages.push({ idx: i,
                        title: typeItem[localStorage.getItem('lang')] || typeItem.type,
                        section: typeItem.type,
                        importance: typeItem.importance,
                        img: typeItem.backgroundImage,
                        component: Lista });
      i++;
    });
    for (var _i = 0; _i < this.pages.length; _i++) {
      if(this.pages[_i].importance === 1){
        this.importancia1.push(new Array(this.pages[_i]));

      }else if(this.pages[_i].importance === 2){
        this.importancia2.push([this.pages[_i],this.pages[_i+1]]);
        _i = _i + 1;
      }else{
        this.importancia3.push([this.pages[_i],this.pages[_i+1],this.pages[_i+2]]);
        _i = _i + 2;
      }

    }
    this.nav && loading.dismiss();
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    console.log(this.nav);


    if(page === 'Ajustes'){
      this.nav.setRoot(Ajustes,{
        "tit":'Ajustes',
        "section":'Ajustes',

      });

    }else if(page === 'Tiempo'){
      this.nav.setRoot(Tiempo);
    }else {

      this.nav.setRoot(page.component,{
        "tit":page.title,
        "section":page.section,
        "index":page.idx,
        "estados": this.estados

      });
    }

  }
}
