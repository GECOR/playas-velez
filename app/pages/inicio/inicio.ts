import {Page, Platform,NavController,Loading,Alert} from 'ionic-angular';
import {Http} from '@angular/http';
import {Lista} from '../lista/lista';
import {Parser} from '../../providers/parser';
import {Ajustes} from '../ajustes/ajustes';
import {Translator} from '../../providers/translator';
import {NgZone, Component,ViewChild} from '@angular/core';
import {Events} from 'ionic-angular';
import {Banderas} from '../../providers/banderas';
import {InAppBrowser, Network} from 'ionic-native';//Connection
@Component({
  templateUrl: 'build/pages/inicio/inicio.html',
  providers: [Parser,Translator,Banderas]
  
})

export class Inicio {

  pages: Array<{idx: number,idTypeItem: number,title: string,section: string,importance: number,img: string, component: any,mostrarType:boolean}>
  data: any;
  translator_object : any;
  importancia1: any[];
  importancia2: any[];
  importancia3: any[];
  menu_title: string;
  ajustes: string;
  inicio: string;
  tiempo : string;
  estados: any;
  typeItems :any;
  loading : any;
  viewInScreen: boolean;
  alert: any;
  constructor(
    private platform: Platform,
    private http: Http,
    private parser: Parser,
    private banderas : Banderas,
    private translator: Translator,
    private _ngZone: NgZone,
    public events: Events,
    private nav: NavController) {

    platform.registerBackButtonAction((event) => {
        if(this.viewInScreen){
          this.backButtonAction();
        }else{
          this.nav.pop();
        }   
      }, 100);
      
    this.loading = Loading.create({
    content: ''
  });

  this.nav.present(this.loading);

 
    if(!localStorage.getItem('lang')){
      localStorage.setItem('lang','es');
    }


    if(Network.connection != 'No network connection' ){//Connection.NONE
      
      this.downloadData();  
          
      
    }else{
      
     this.getDBLocal();
     
     
    }
    


    events.subscribe('lang:changed', (lang) => {
      this.ajustes = this.translator_object[lang[0]]['TIT_AJUSTES'];
      console.log(this.ajustes);
      this.pages = new Array();
      this.importancia1 = new Array();
      this.importancia2 = new Array();
      this.importancia3 = new Array();
      
        var i = 0;
        this.typeItems.forEach(typeItem => {
          this.pages.push({ idx: i,
                            idTypeItem: typeItem.idTypeItem,
                            title: typeItem[lang[0]] || typeItem.type,
                            section: typeItem.type,
                            importance: typeItem.importance,
                            img: typeItem.backgroundImage,
                            component: Lista,
                            mostrarType: typeItem.mostrarType });
                            console.log(this.pages);
          i++;
          if(i === this.typeItems.length){
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
          }
        });
        
      });
    
  }

  ionViewLoaded(){
    this.viewInScreen = true;
  }

  ionViewWillEnter(){
    this.viewInScreen = true;
  }

  ionViewDidLeave(){
    this.viewInScreen = false;
  }

  getDBLocal(){
    if(localStorage.getItem('banderas')){
       
       this.estados = JSON.parse(localStorage.getItem('banderas'));
       this.estados = this.estados && this.estados.playas;
       this.insertTypeItems(JSON.parse(localStorage.getItem('data')).typeItems);
        setTimeout(() => {
        this.loading.dismiss();
      }, 500);
     }else{
        setTimeout(() => {
        this.loading.dismiss();
      }, 500);
       let alert = Alert.create({
        title: 'Error',
        message: "Debe tener acceso a internet para usarlo la primera vez",
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
                return;
            }
          }
        ]

      });
      
      this.nav.present(alert);
       
       
     }
  }
  downloadData(){
    
    this.translator.load().then(data =>{
      this.ajustes = data[localStorage.getItem('lang')]['TIT_AJUSTES'];
      this.tiempo = data[localStorage.getItem('lang')]['TIEMPO'];
      console.log(this.ajustes);
      this.translator_object = data;
      console.log(this.translator_object);

      
      setTimeout(()=>{
        if(!this.estados){
          this.getDBLocal();
        }
      },20000);
      this.parser.getTypeItems().then(typeItems => {
        this.typeItems = typeItems;
        this.insertTypeItems(typeItems);
        
        this.banderas.getEstados().then(estados =>{
          
          this.estados = estados;
          setTimeout(() => {
            this.loading.dismiss();
          }, 500);
            });

      });

    });
  }
  
  insertTypeItems(typeItems){
    this.pages = new Array();
      this.importancia1 = new Array();
      this.importancia2 = new Array();
      this.importancia3 = new Array();
    var i = 0;
    typeItems.forEach(typeItem => {
      this.pages.push({ idx: i,
                        idTypeItem: typeItem.idTypeItem,
                        title: typeItem[localStorage.getItem('lang')] || typeItem.type,
                        section: typeItem.type,
                        importance: typeItem.importance,
                        img: typeItem.backgroundImage,
                        component: Lista, 
                        mostrarType: typeItem.mostrarType});
      i++;
      
      if(i === typeItems.length){
        for (var _i = 0; _i < this.pages.length; _i++) {
          console.log(this.pages[_i])
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
      }
    });
    
    console.log("importancia1:",this.importancia1);
    console.log("importancia2:",this.importancia2);
    console.log("importancia3:",this.importancia3);
    
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    console.log(this.nav);


    if(page === 'Ajustes'){
      this.nav.push(Ajustes,{
        "tit":'Ajustes',
        "section":'Ajustes',
        "translator":this.translator_object
      });

    }else if(page.idTypeItem === 1011){
     if(this.platform.is('ios')){
        InAppBrowser.open('https://itunes.apple.com/in/app/incidencias-velez-malaga/id990970923?mt=8','_system','location=yes'); 
     }else if(this.platform.is('android')){
        InAppBrowser.open('https://play.google.com/store/apps/details?id=com.gecor.VelezMalaga','_system','location=yes'); 
     }
      
    }else if(page.idTypeItem === 1015){
    
    this.loading = Loading.create({content:''});
      this.nav.present(this.loading);
      setTimeout(() =>{
        this.nav.push(page.component,{
        "tit":this.translator_object[localStorage.getItem('lang')]['SELECCIONA_PLAYA'],
        "section":this.pages[0].section,
        "index":this.pages[0].idx,
        "estados": this.estados,
        "idTypeItem": page.idTypeItem,
        "translator":this.translator_object,
        "loading": this.loading,
        "typeItems" : this.typeItems
      });
      },100)
  
    }else{
     this.loading = Loading.create({content:''});
      this.nav.present(this.loading);
      setTimeout(() =>{
        this.nav.push(page.component,{
        "tit":page.title,
        "section":page.section,
        "index":page.idx,
        "estados": this.estados,
        "idTypeItem": page.idTypeItem,
        "translator":this.translator_object,
        "loading": this.loading,
        "typeItems" : this.typeItems
      });
      },100)
      
    }

  };

  /*onPageWillLeave(){
    this.backButtonAction();
  }*/

  backButtonAction(){
    if(this.alert == undefined){
      this.alert = Alert.create({
      title: 'Atención',
      message: '¿Desea salir de la aplicación?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            //Do nothing
            this.alert = undefined;
          }
        },
        {
          text: 'SI',
          handler: () => {
            //this.nav.push(Inicio);
            this.alert = undefined;
            this.platform.exitApp();
          }
        }
      ]
    });
    this.nav.present(this.alert);
    }
  }
}
