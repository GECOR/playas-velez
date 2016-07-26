import {Page, NavController,NavParams,Alert,Platform,Loading} from 'ionic-angular';
import {NgZone,Component, ComponentRef, Input, ViewContainerRef, ComponentResolver, ViewChild} from '@angular/core';
import {SocialSharing,InAppBrowser} from 'ionic-native';
import {Translator} from '../../../providers/translator';
import {Moraga} from './moraga/moraga';

@Component({
  providers: [Translator],
  templateUrl: 'build/pages/lista/detalle/detalle.html'
})

export class DetallePage {
  
  item:any;
  tit: string;
  isAndroid: any;
  map: any;
  markerArray: any[];
  latLng: any;
  startAddress: string;
  endAddress: string;
  travelMode: string;
  timeTravel: string;
  distanceTravel: string;
  directionsService: any;
  geocoderService: any;
  directionsDisplay: any;
  stepDisplay: any;
  response: any;
  translator_object: any;
  compartir: string;
  comenzar: string;
  moraga:string;
  date : string;
  items : any;
  positionImages : number;
  labelMarker : string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  labelIndex : number = 0;
  
  constructor(private resolver: ComponentResolver,private platform: Platform,private nav: NavController,private params: NavParams, private zone: NgZone,private translator: Translator){
    let loading = this.params.get('loading');   

      this.translator_object = this.params.get('translator');
      this.compartir = this.translator_object[localStorage.getItem('lang')]["COMPARTIR"];
      this.comenzar = this.translator_object[localStorage.getItem('lang')]["COMENZAR"];
      this.moraga = this.translator_object[localStorage.getItem('lang')]["MORAGA"];
    
    this.item = params.get('item');
   
    console.log(this.item);
    this.tit = params.get('tit');
    this.items = params.get('items');
    console.log(params.get('playa'));
    this.platform = platform;
    this.isAndroid = platform.is('android');

    this.map = null;
    this.markerArray = [];

    this.positionImages = 0;

   
        this.initGeolocation();
        if (this.item.coordinates[0] != undefined){
          if(this.item.coordinates[0]){
            let latlng = new google.maps.LatLng(this.item.coordinates[0] && this.item.coordinates[0].latitude, this.item.coordinates[0] && this.item.coordinates[0].longitude);
            this.geocoderService = new google.maps.Geocoder;
            this.geocoderService && this.geocoderService.geocode({'location': latlng}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.endAddress = results[0].formatted_address;
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
            setTimeout(() => {
              loading.dismiss();
            }, 500);
          });
        }
      }else{
        loading.dismiss();
      }
  }
 

  
  //MAP
  loadMap() {//ngAfterViewInit

    this.directionsService = new google.maps.DirectionsService();

    let mapOptions = {
        center:  new google.maps.LatLng(this.item.coordinates[0] && this.item.coordinates[0].latitude,this.item.coordinates[0] && this.item.coordinates[0].longitude),
        zoom: 10, //16
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true
    }
    this.map = new google.maps.Map(document.getElementById("mapDetail"), mapOptions);
    if(this.item.coordinates[0]){
      this.item.coordinates.forEach(coordinate => {
        console.log("|----------------------------------------ARDRUINO MOLA------------------------------------------------|");
        console.log(coordinate);
        console.log("|----------------------------------------------------------------------------------------|");
      let infoWindow = new google.maps.InfoWindow({
        //content: `<h5>${markerData.name}</h5>`
        content: `<ion-card>
                    <!--<ion-thumbnail>
                      <img src="${this.item.images[0].image}">
                    </ion-thumbnail>-->
                    <ion-item class="item">
                      <ion-icon item-left="" large="" name="map" role="img" class="ion-ios-information-circle item-icon" aria-label="map"></ion-icon>
                      <div class="item-inner">
                        <div class="input-wrapper">
                          <ion-label>
                            <h3>${coordinate.title}</h3>
                            <p class="description">${coordinate.description && coordinate.description.substring(0,50) + "..."}</p>
                          </ion-label>
                        </div>
                      </div>
                    </ion-item>
                    <button onclick="window.location.href='http://maps.google.com/maps?q=loc:${coordinate.latitude},${coordinate.longitude}'" clear="" item-right="" primary="" class="disable-hover item-button button button-clear button-clear-primary button-icon-left">
                      <span class="button-inner">
                        <ion-icon name="navigate" role="img" class="ion-ios-navigate" aria-label="navigate"></ion-icon>
                        Ir al lugar
                      </span>
                    </button>
                  </ion-card>`
      });
      //labels: this.labels[this.labelIndex++ % this.labels.length]
      /*var marker2 = new google.maps.MarkerOptions({
        draggable: true,
        labelContent: "$425K",
        labelAnchor: new google.maps.Point(22, 0),
        labelClass: "labels", // the CSS class for the label
        labelStyle: {opacity: 0.75}
      });*/

      //this.labelMarker = '10'; //this.positionImages.toString();

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(coordinate.latitude, coordinate.longitude),
        map: this.map,
        label: coordinate.letraMayus //this.labelMarker[this.positionImages]
      });

      this.positionImages  = this.positionImages + 1;

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });
    }
    
    
    
        
      

  }

  centerMap() {
    this.map.setCenter(this.latLng);

  }

  classPlayas(item){
    return 'idItem' + item.idItem;
  }

  initGeolocation() {
    let options = {maximumAge: 5000, timeout: 15000, enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(
      (position) => {

        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (this.latLng != undefined){
          this.geocoderService.geocode({'location': this.latLng}, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              this.startAddress = results[0].formatted_address;
              this.loadMap();
              if (this.item.coordinates.length==1){
                this.calculateAndDisplayRoute();
              }
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
        }
      },
      (error) => {
        this.loadMap();
      }, options);
  }




  calculateAndDisplayRoute() {
    let directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});
    let stepDisplay = new google.maps.InfoWindow;
    // First, remove any existing markers from the map.
    for (let i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    console.log(this.startAddress,this.endAddress);
    this.directionsService.route({
      origin: this.startAddress,//document.getElementById('start').value,
      destination: this.endAddress,//document.getElementById('end').value,
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      // Route the directions and pass the response to a function to create
      // markers for each step.
      this.response = response;
      if (status === google.maps.DirectionsStatus.OK) {
        /*document.getElementById('warnings-panel').innerHTML =
            '<b>' + response.routes[0].warnings + '</b>';*/

        console.log(response.routes);
        this.zone.run(() => {
          this.timeTravel = response.routes[0].legs[0].duration.text;
          this.distanceTravel = response.routes[0].legs[0].distance.text;
        });

        directionsDisplay.setDirections(response);
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
  
  childForItem(idItem){
    console.log("idItem",idItem);
    return function(item){
      console.log(item);
      // ES == PORQUE LLEGA UN STRING Y HAY QUE COMPARARLO CON UN ENTERO
      return item.idItem == idItem;
    }
  }
  
  openWeb(url){
    InAppBrowser.open(url,'_system', 'location=no')
  }
  
  openPlayaAsociada(idItem){
    let loading = Loading.create({content:''});
    this.nav.present(loading);
     setTimeout(() =>{
      let item1= this.items.filter(this.childForItem(idItem))[0];
      console.log(item1);
        this.nav.push(DetallePage, {
        'item':item1,
        'tit': this.tit,
        
        'translator': this.translator_object,
        'loading' : loading
        });
      },300);
  }
  
  

  openMap(){
    if(this.platform.is('ios')){
      InAppBrowser.open('http://maps.apple.com/?saddr='+this.startAddress+'&daddr='+this.endAddress,'_system', 'location=no')
    }else{
      InAppBrowser.open('http://maps.google.com/maps?   saddr='+this.latLng.lat+','+this.latLng.long+'&daddr='+this.item.coordinates[0].latitude+','+this.item.coordinates[0].longitude+'&directionsmode=driving','_system', 'location=no')
    }
  }

  openMoraga(item){
    this.nav.push(Moraga, {
    'item':item,
    'playa': this.params.get('playa'),
    'translator': this.translator_object
    });
  }

  //END MAP

  share(message,subject,file,url){
    SocialSharing.share(message,subject,file,url);
  }
  
  
}
