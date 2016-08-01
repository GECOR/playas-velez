import {Page, NavController, NavParams,Alert,Loading} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {DetallePage} from './detalle/detalle';
import {Parser} from '../../providers/parser';
import {Translator} from '../../providers/translator';
import {InAppBrowser} from 'ionic-native';
import {Banderas} from '../../providers/banderas';
import {Inicio} from './../inicio/inicio';
import {Moraga} from './detalle/moraga/moraga';
import {Component} from '@angular/core';
import {SanitizeHtml} from '../../pipes/sanitize';
import * as moment_ from 'moment';

const moment: moment.MomentStatic = (<any>moment_)['default'] || moment_;

@Component({
  templateUrl: 'build/pages/lista/lista.html',
  providers: [Parser,Banderas],
  pipes: [SanitizeHtml]
})
export class Lista {
    tit: string
    items = []
    idx = 0
    tipo: string = "Lista";
    map: any;
    markerArray: any[];
    latLng: any;
    startAddress: string;
    travelMode: string;
    timeTravel: string;
    distanceTravel: string;
    directionsService: any;
    geocoderService: any;
    directionsDisplay: any;
    stepDisplay: any;
    translator_object: any;
    lista: string;
    mapa: string;
    galeria: string;
    ruta: string;
    all_estados = [];
    filtrar : string;
    todas: string;
    certificado_q : string;
    adaptadass : string;
    moragass : string;
    section: string;
    estados =[];
    idTypeItem: number;
    loadedEstados: boolean = false;
    
    constructor(private nav: NavController, private params : NavParams, private parser: Parser, private banderas : Banderas, private _ngZone: NgZone,private translator: Translator) {
      let loading = this.params.get('loading');
            
      this.translator_object = this.params.get('translator');
      this.lista = this.translator_object[localStorage.getItem('lang')]['LISTA'];
      this.mapa = this.translator_object[localStorage.getItem('lang')]['MAPA'];
      this.galeria = this.translator_object[localStorage.getItem('lang')]['GALERIA'];
      this.ruta = this.translator_object[localStorage.getItem('lang')]['RUTA'];
      this.filtrar = this.translator_object[localStorage.getItem('lang')]['FILTRAR'];
      this.todas = this.translator_object[localStorage.getItem('lang')]['TODAS'];
      this.certificado_q = this.translator_object[localStorage.getItem('lang')]['CERTIFICADO_Q'];
      this.adaptadass = this.translator_object[localStorage.getItem('lang')]['ADAPTADAS'];
      this.moragass = this.translator_object[localStorage.getItem('lang')]['MORAGA'];

      this.params = params;

      this.tit = this.params.get('tit');
      this.idx = this.params.get('index');
      this.idTypeItem = this.params.get('idTypeItem');
      this.section = this.params.get('section');
      this.estados = this.params.get('estados');
     
      // Variable auxiliar necesaria para filtrar posteriormente
      this.all_estados = this.estados;
      
      // Recibimos los items enviados como parametro del nav
      this.items = this.parser.getItems(this.params.get('typeItems'),this.idx)
      
      // Si estamos en playas, debemos crear los estados asociados a cada uno de los items,
      // Ya que en base de datos están en tablas diferentes
      if(this.section === 'Playas'){
        this.estados.forEach(estado =>{
          let item1= this.items.filter(this.childForItem(estado.idItem))[0];
          if (item1 != undefined){
            estado.rightBarColor = item1.rightBarColor;
            estado.backgroundImage = item1.backgroundImage;
          }            
        })
      }
      // Si venimos de clickar en solicitud de moraga, hay que filtrar por moragas
      if(this.idTypeItem == 1015){
        this.filterList('moragas');
      }
      this.loadedEstados = true;
      
      // Todo listo, quitamos el loading
      setTimeout(() => {
        loading.dismiss();
      }, 500);
      
      // Inicializamos las variables para el mapa
      this.map = null;
      this.markerArray = [];
      this.travelMode = 'WALKING';
      this.timeTravel = '0 min';
      this.distanceTravel = '0 km';
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      // Llamamos al geolocalizador
      //this.initGeolocation();
      
      moment.locale('es', {
        months : [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ],
        weekdays : 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        weekdaysShort : 'Dom._Lun._Mar._Mié._Jue._Vie._Sáb.'.split('_'),
        weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
        longDateFormat : {
            LT : 'H:mm',
            LTS : 'LT:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [de] MMMM [de] YYYY',
            LLL : 'D [de] MMMM [de] YYYY LT',
            LLLL : 'dddd, D [de] MMMM [de] YYYY LT'
        },
        calendar : {
            sameDay : function () {
                return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextDay : function () {
                return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            nextWeek : function () {
                return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastDay : function () {
                return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            lastWeek : function () {
                return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
            },
            sameElse : 'L'
        },
        relativeTime : {
            future : 'en %s',
            past : 'hace %s',
            s : 'unos segundos',
            m : 'un minuto',
            mm : '%d minutos',
            h : 'una hora',
            hh : '%d horas',
            d : 'un día',
            dd : '%d días',
            M : 'un mes',
            MM : '%d meses',
            y : 'un año',
            yy : '%d años'
        }        
    });

  }

  showMap() {
    setTimeout(()=>{
      this.loadMap()
    },2000)
  }

//MAP
  loadMap() {//ngAfterViewInit

    let mapEle = document.getElementById('map');

    let coord = (this.items[0] && this.items[0].coordinates && this.items[0].coordinates.find(d => d.center)) || {latitude:36.781381,longitude:-4.104128};
    let latlng = new google.maps.LatLng(coord && coord.latitude,coord && coord.longitude) || this.latLng;

    this.map = new google.maps.Map(mapEle, {
      center: latlng,
      zoom: 11,
      disableDefaultUI: true
    });
    // Si venimos de solicitud de moraga, solo ponemos marca donde se pueda hacer moraga
    if(this.idTypeItem == 1015){
      this.estados.forEach(estado =>{
            let item1= this.items.filter(this.childForItem(estado.idItem))[0];
            if (item1 != undefined){
              this.addMarkOnMap(item1,mapEle);
            }            
          })
    }else{
       this.items.forEach(item => {
      
      this.addMarkOnMap(item,mapEle);

    });
    }


   
  }
  itemTapped(event, item) {
    
    if(this.idTypeItem == 1006 ){
      let loading = Loading.create({content:''});
      this.nav.present(loading);
      
      setTimeout(() =>{
        let item1= this.items.filter(this.childForItem(item.idItem))[0];
        
        this.nav.push(DetallePage, {
        'item':item1,
        'tit': this.tit,
        'playa': item,
        'translator': this.translator_object,
        'loading' : loading
        });
      },300);
    }else if(this.idTypeItem == 1015){
      
       setTimeout(() =>{
        let item1= this.items.filter(this.childForItem(item.idItem))[0];
        this.nav.push(Moraga, {
          'item':item1,
          'playa': item,
          'translator': this.translator_object
        });
      },300);
      
    }else if(item.pdf){
      InAppBrowser.open(item.web,"_system",'location=yes');
    }else{
      let loading = Loading.create({content:''});
      this.nav.present(loading);
      setTimeout(() =>{
        this.nav.push(DetallePage, {
          'items': this.items,
          'item':item,
          'tit': this.tit,
          'translator': this.translator_object,
          'loading' : loading
        });
      },300);
    }
  }

  addMarkOnMap(item,mapEle){
    if(item.coordinates[0]){
        item.coordinates.forEach(coordinate => {
        let infoWindow = new google.maps.InfoWindow({
          //content: `<h5>${markerData.name}</h5>`
          content: `<ion-item>
                      <ion-thumbnail>
                        <img src="${item.images[0].image}">
                      </ion-thumbnail>
                      <h2>${item.title}</h2>
                      <span>${item.dates[0] ? new Date(item.dates[0].date * 1000).toLocaleString() : ""}</span><br>
                      <span>${item.telefono ? item.telefono : ""}</span><br>
                      <span>${item.email ? item.email : ""}</span><br>
                      <p>${item.description ? item.description : ""}</p><br>
                    </ion-item>`
        });
        
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(coordinate.latitude, coordinate.longitude),
          map: this.map
        });    

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
      });

      }
      
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

  initGeolocation() {

    let options = {maximumAge: 5000, timeout: 15000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.geocoderService = new google.maps.Geocoder;

        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.geocoderService.geocode({'location': this.latLng}, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              
              this.startAddress = results[0].formatted_address;
              this.loadMap();
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      },
      (error) => {
      
       
      }, options);
  }




  calculateAndDisplayRoute() {
    this.directionsDisplay.setMap(this.map)
    console.log(this.map);
    // First, remove any existing markers from the map.
    for (let i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    console.log(this.map);
    var waypts = [];
    var checkboxArray = document.getElementById('waypoints');
    this.items.forEach(item =>{

      item.coordinates.forEach(coordinate =>{

        waypts.push({
              location: new google.maps.LatLng(coordinate.latitude,coordinate.longitude),
              stopover: true
            });

      });
    })

    this.directionsService.route({
      origin: this.startAddress,//document.getElementById('start').value,
      destination: this.startAddress,//document.getElementById('end').value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      //console.log(response);
      if (status === google.maps.DirectionsStatus.OK) {
        /*document.getElementById('warnings-panel').innerHTML =
            '<b>' + response.routes[0].warnings + '</b>';*/

        console.log(response.routes);
        this._ngZone.run(() => {
          this.timeTravel = response.routes[0].legs[0].duration.text;
          this.distanceTravel = response.routes[0].legs[0].distance.text;
        });

        this.directionsDisplay.setDirections(response);
        //Muestra markers en los cambios de dirección
        //this.showSteps(response, stepDisplay);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  showSteps(directionResult, stepDisplay) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    let myRoute = directionResult.routes[0].legs[0];

    for (let i = 0; i < myRoute.steps.length; i++) {
      let marker = this.markerArray[i] = this.markerArray[i] || new google.maps.Marker;
      marker.setMap(this.map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(marker, myRoute.steps[i].instructions, stepDisplay);
    }
  }

  attachInstructionText(marker, text, stepDisplay) {
    google.maps.event.addListener(marker, 'click', function() {
      console.log(text);
      stepDisplay.setContent(text);
      stepDisplay.open(this.map, marker);
    });
  }

//END MAP

  // FILTROS 
  moragas(item){

    return item.moraga === true;
  }
  adaptadas(item){

    return item.adaptadas === true;
  }

  Q(item){

    return item.q === true;
  }

  filterList(filter){
    this._ngZone.run(() => {
      this.estados  = this.all_estados;
      let aux ;
      
      if(filter === 'adaptadas'){

        aux= this.items.filter(this.adaptadas);
           
      }else if (filter === 'Q') {

        aux = this.items.filter(this.Q);
       
      }else if (filter === 'moragas') {
               
        aux = this.items.filter(this.moragas);
           
      }
       this.estados = [];
       for(var i = 0; i< aux.length;i++){
         this.estados.push(this.all_estados.filter(this.childForItem(aux[i].idItem))[0]);
       }     
    })
  }
  
  // END FILTROS

  childForItem(idItem){
    console.log("idItem",idItem);
    return function(item){
      console.log(item);
      // ES == PORQUE LLEGA UN STRING Y HAY QUE COMPARARLO CON UN ENTERO
      return item.idItem == idItem;
    }
  }

  openHome() {
    this.nav.setRoot(Inicio,{});
  }

  parseDate(dateEpoch){
    return moment(dateEpoch).format('L');
  }

}
