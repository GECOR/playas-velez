
import {Inicio} from './pages/inicio/inicio';
import {ViewChild, NgZone, Component} from '@angular/core';
import {App, Platform,NavController, Loading, Nav,ionicBootstrap} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';
import {Push} from 'ionic-native';
import {Parser} from './providers/parser';
import {Translator} from './providers/translator';
import {Banderas} from './providers/banderas';
@Component({
  templateUrl: 'build/app.html',
 
})

/***************************************
 * ESTA CLASE ES PARA INICIAR LA APP
 * SOLO REALIZA EL REGISTRO DE NOT. PUSH
 ***************************************/

 class MyApp {
  
  @ViewChild(Nav) nav: Nav;
   
  rootPage: any = Inicio;
   
  constructor(private app: App,private platform: Platform) {

    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
    setTimeout(function() {
    Splashscreen.hide();
        }, 100);
       /*var push = Push.init({
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
        });*/
    });
  }
}
// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/

ionicBootstrap(MyApp, [Parser,Translator,Banderas],{
  
    backButtonText: ''

});