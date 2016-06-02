import {Page, NavController, NavParams,Alert,Loading} from 'ionic-angular';
import {NgZone} from '@angular/core';
import {DetallePage} from './detalle/detalle';
import {Parser} from '../../providers/parser';
import {Translator} from '../../providers/translator';
import {InAppBrowser} from 'ionic-native';
import {Banderas} from '../../providers/banderas';
@Page({
  templateUrl: 'build/pages/lista/lista.html',
  providers: [Parser,Banderas]
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
    section: string;
    estados =[];
    idTypeItem : number;
    constructor(private nav: NavController, private params : NavParams, private parser: Parser, private banderas : Banderas, private _ngZone: NgZone,private translator: Translator) {
      let loading = Loading.create({content:""});
      this.nav.present(loading);
      translator.load().then(data =>{
        this.translator_object = data;
        this.lista = data[localStorage.getItem('lang')]['LISTA'];
        this.mapa = data[localStorage.getItem('lang')]['MAPA'];
        this.galeria = data[localStorage.getItem('lang')]['GALERIA'];
        this.ruta = data[localStorage.getItem('lang')]['RUTA'];
        this.filtrar = data[localStorage.getItem('lang')]['FILTRAR'];
        this.todas = data[localStorage.getItem('lang')]['TODAS'];
        this.certificado_q = data[localStorage.getItem('lang')]['CERTIFICADO_Q'];
        this.adaptadass = data[localStorage.getItem('lang')]['ADAPTADAS'];
      });

      this.params = params;

      this.tit = this.params.get('tit');
      this.idx = this.params.get('index');
      this.idTypeItem = this.params.get('idTypeItem');
      this.section = this.params.get('section');
      this.estados = this.params.get('estados');

      console.log(Object.keys(this.estados[0]))
      this.all_estados = this.estados;


      this.parser.getItems(this.idx).then(lista =>{
        this.items = lista;
        if(this.section = 'Playas'){
          this.estados.forEach(estado =>{
            let item1= this.items.filter(this.childForItem(estado.idItem))[0];
            if (item1 != undefined){
              estado.rightBarColor = item1.rightBarColor;
              estado.backgroundImage = item1.backgroundImage;
            }            
          })
        }
        loading.dismiss();
      });


      this.map = null;
      this.markerArray = [];
      this.travelMode = 'WALKING';
      this.timeTravel = '0 min';
      this.distanceTravel = '0 km';
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      //this.initGeolocation();

    }

  showMap() {

    setTimeout(()=>{
      this.loadMap()

    },100)


}

//MAP
loadMap() {//ngAfterViewInit

  let mapEle = document.getElementById('map');

  let coord = (this.items[0] && this.items[0].coordinates && this.items[0].coordinates.find(d => d.center)) || {latitude:36.781381,longitude:-4.104128};
  let latlng = new google.maps.LatLng(coord && coord.latitude,coord && coord.longitude) || this.latLng;

  this.map = new google.maps.Map(mapEle, {
    center: latlng,
    zoom: 16,
    disableDefaultUI: true
  });


  this.items.forEach(item => {

    item.coordinates.forEach(coordinate => {
      let infoWindow = new google.maps.InfoWindow({
        //content: `<h5>${markerData.name}</h5>`
        content: `<ion-item>
                    <ion-thumbnail>
                      <img src="${item.images[0].image}">
                    </ion-thumbnail>
                    <h2>${item.title}</h2>
                    <span>${item.dates[0] ? new Date(item.dates[0].startDate * 1000).toLocaleString() : ""}</span><br>
                    <span>${item.telefono ? item.telefono : ""}</span><br>
                    <span>${item.email ? item.email : ""}</span><br>
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

  });

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
     
      let alert = Alert.create({
      title: error.code.toString(),
      subTitle: error.message,
      buttons: [
        {
          text: this.translator_object[localStorage.getItem('lang')]['REINTENTAR'],
          role: 'reload',
          handler: () => {
            this.loadMap();
          }
        }
        ]
      });
      this.nav.present(alert);
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

    itemTapped(event, item) {
      console.log("estado",item);
      console.log(this.nav);
      if(this.section === 'Playas'){
        let item1= this.items.filter(this.childForItem(item.idItem))[0];

        this.nav.push(DetallePage, {
        'item':item1,
        'tit': this.tit,
        'playa': item
        });
      }else if(item.pdf){
        InAppBrowser.open(item.web,"_system",'location=yes');
      }else{
        this.nav.push(DetallePage, {
        'item':item,
        'tit': this.tit

        });
      }


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
        if(filter === 'adaptadas'){
          let aux ;
          aux= this.items.filter(this.adaptadas);
          this.estados = [];

          for(var i = 0; i< aux.length;i++){
            this.estados.push(this.all_estados.filter(this.childForItem(aux[i].idItem))[0]);
          }          
          

        }else if (filter === 'Q') {
          //this.estados = this.items.filter(this.Q);
           let aux ;
          aux = this.items.filter(this.Q);
          this.estados = [];
          for(var i = 0; i< aux.length;i++){
            this.estados.push(this.all_estados.filter(this.childForItem(aux[i].idItem))[0]);
          }          
        }
        console.log(this.estados);

      })
    }
    childForItem(idItem){
      console.log("idItem",idItem);
      return function(item){
        console.log(item);
        // ES == PORQUE LLEGA UN STRING Y HAY QUE COMPARARLO CON UN ENTERO
        return item.idItem == idItem;
      }
    }

}
