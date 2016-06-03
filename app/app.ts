import {App, IonicApp, Platform,NavController, Loading, Nav} from 'ionic-angular';
import {Http} from '@angular/http';
import {Lista} from './pages/lista/lista';
import {Parser} from './providers/parser';
import {Ajustes} from './pages/ajustes/ajustes';
import {Translator} from './providers/translator';
import {ViewChild, NgZone, Component} from '@angular/core';
import {Events} from 'ionic-angular';
import {Inicio} from './pages/inicio/inicio';
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
  pages: Array<{idx: number,idTypeItem:number,title: string,section: string,importance: number,img: string, component: any}>
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


   

    this.initializeApp();

  

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


    /*console.log(this.nav);
    if(page === 'Ajustes'){
      this.nav.setRoot(Ajustes,{
        "tit":'Ajustes',
        "section":'Ajustes',

      });

    }else if(page === 'Inicio'){
      this.nav.setRoot(Inicio);
    }else {

      this.nav.setRoot(page.component,{
        "tit":page.title,
        "section":page.section,
        "index":page.idx,
        "estados": this.estados,
        "idTypeItem": page.idTypeItem
      });
    }
    */
  }
}
