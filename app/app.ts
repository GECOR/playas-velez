import {App, IonicApp, Platform,NavController, Loading, Nav} from 'ionic-angular';
import {Http} from '@angular/http';
import {Lista} from './pages/lista/lista';
import {Parser} from './providers/parser';
import {Ajustes} from './pages/ajustes/ajustes';
import {Translator} from './providers/translator';
import {ViewChild, NgZone, Component} from '@angular/core';
import {Events} from 'ionic-angular';
import {Inicio} from './pages/inicio/inicio';
import {Tiempo} from './pages/tiempo/tiempo';
import {CalendarPage} from './pages/calendar/calendar';
import {Banderas} from './providers/banderas';

@App({
  templateUrl: 'build/app.html',
  providers: [Parser,Translator,Banderas],
  config: {
    backButtonText: ''
  } // http://ionicframework.com/docs/v2/api/config/Config/
})

class MyApp {
  
  @ViewChild(Nav) nav: Nav;
   
  rootPage: any = Inicio;
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
  estados : any;
  
  constructor(private app: IonicApp,
    private platform: Platform,
    private http: Http,
    private parser: Parser,
    private banderas: Banderas,
    private translator: Translator,
    private _ngZone: NgZone,
    public events: Events) {

this.estados = JSON.parse(localStorage.getItem('banderas'));
    this.estados = this.estados && this.estados.playas;

    this.initializeApp();

    if(!localStorage.getItem('lang')){
      localStorage.setItem('lang','es');
    }


    parser.load().then(); // Download JSON data
    banderas.getEstados().then(estados =>{
      this.estados = estados;
    });


    translator.load().then(data =>{
      this.ajustes = data[localStorage.getItem('lang')]['TIT_AJUSTES'];
      this.inicio = data[localStorage.getItem('lang')]['INICIO'];
      this.tiempo = data[localStorage.getItem('lang')]['TIEMPO'];
      console.log(this.ajustes);
      this.translator_object = data;

      this.pages = new Array();
      this.importancia1 = new Array();
      this.importancia2 = new Array();
      this.importancia3 = new Array();
      this.parser.getTypeItems().then(typeItems => {
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

      });
    });


    events.subscribe('lang:changed', (lang) => {
      this.ajustes = this.translator_object[lang[0]]['TIT_AJUSTES'];
      this.inicio = this.translator_object[lang[0]]['INICIO'];
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

  initializeApp() {
    this.platform.ready().then(() => {

      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    
    //var nav = this.app.getComponent('nav');


    console.log(this.nav);
    if(page === 'Ajustes'){
      this.nav.setRoot(Ajustes,{
        "tit":'Ajustes',
        "section":'Ajustes',

      });

    }else if(page === 'Inicio'){
      this.nav.setRoot(Inicio);
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
