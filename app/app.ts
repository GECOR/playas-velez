
import {Http} from '@angular/http';
import {Lista} from './pages/lista/lista';
import {Parser} from './providers/parser';
import {Ajustes} from './pages/ajustes/ajustes';
import {Translator} from './providers/translator';
import {ViewChild, NgZone, Component} from '@angular/core';
import {App, Platform,NavController, Loading, Nav,ionicBootstrap} from 'ionic-angular';
import {Events} from 'ionic-angular';
import {Inicio} from './pages/inicio/inicio';
import {Splashscreen} from 'ionic-native';
import {Banderas} from './providers/banderas';
import {Push} from 'ionic-native';
@Component({
  templateUrl: 'build/app.html',
 
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
  
  constructor(private app: App,
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
    setTimeout(function() {
    Splashscreen.hide();
        }, 100);
       var push = Push.init({
          android: {
            senderID: "1060313159714"
          },
          ios: {
            alert: "true",
            badge: true,
            sound: 'false'
          },
          windows: {}
        });
        push.on('registration', (data) => {
          console.log(data.registrationId);
          alert(data.registrationId.toString());
        });
        push.on('notification', (data) => {
          console.log(data);
          alert("Hi, Am a push notification");
        });
        push.on('error', (e) => {
          console.log(e.message);
        });
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
// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/

ionicBootstrap(MyApp, [Parser,Translator,Banderas],{
  
    backButtonText: ''

});