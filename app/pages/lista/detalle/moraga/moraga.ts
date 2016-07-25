/// <reference path="../../../../../typings/tsd.d.ts"/>

import {Page, NavController, NavParams,Modal,Platform,ViewController,Alert,Loading} from 'ionic-angular';
import {Parser} from '../../../../providers/parser';
import {Translator} from '../../../../providers/translator';
import {Events} from 'ionic-angular';
import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit, NgZone} from '@angular/core';
import {NgIf, NgFor, NgClass, NgModel, FORM_DIRECTIVES, ControlValueAccessor} from '@angular/common';
import * as moment_ from 'moment';
import {Http,Headers, RequestOptions} from '@angular/http';
import {Inicio} from '../../../../pages/inicio/inicio';

const moment: moment.MomentStatic = (<any>moment_)['default'] || moment_;

@Component({
  templateUrl: 'build/pages/lista/detalle/moraga/moraga.html',
  providers: [Parser,Translator]
})


export class Moraga{
  tit:string;
  translator_object: any;
  item: any;
  playa: any;
  newMoraga: any = {
    "Nombre": "",
    "Apellidos": "",
    "DNI": "",
    "Direccion": "",
    "CodPost": "",
    "Email": "",
    "TlfMovil": "",
    "Dia": "",
    "NumAsistentes":"",
    "Observaciones": "",
    "PlayaID": 0,
    "Playa": "",
    "AyuntamientoID": 39,
  };
 nombre: string;
 apellidos: string;
 dni: string;
 direccion: string;
 codpostal: string;
 email: string;
 tlfmovil: string;
 personas: string;
 observaciones: string;
 avisolegal: string;
 fecha: string;
 button: string;
  aviso : boolean;
  constructor(private nav: NavController,
     private params : NavParams,
     private parser: Parser,
     private translator: Translator,
     private _ngZone: NgZone,
     private http: Http,
     public events: Events){
               
       this.item = params.get('item');
       this.playa = params.get('playa');
       this.translator_object = params.get('translator')
       this.tit = this.translator_object[localStorage.getItem('lang')]['MORAGA'];         
       this.nombre = this.translator_object[localStorage.getItem('lang')]['FORM_NOMBRE'];
       this.apellidos = this.translator_object[localStorage.getItem('lang')]['FORM_APELLIDOS'];
       this.dni = this.translator_object[localStorage.getItem('lang')]['FORM_DNI'];
       this.direccion = this.translator_object[localStorage.getItem('lang')]['FORM_DIRECCION'];
       this.codpostal = this.translator_object[localStorage.getItem('lang')]['FORM_CODPOST'];
       this.email = this.translator_object[localStorage.getItem('lang')]['FORM_EMAIL'];
       this.tlfmovil = this.translator_object[localStorage.getItem('lang')]['FORM_TLFMOVIL'];
       this.personas = this.translator_object[localStorage.getItem('lang')]['FORM_PERSONAS'];
       this.observaciones = this.translator_object[localStorage.getItem('lang')]['FORM_OBSERVACIONES'];
       this.button = this.translator_object[localStorage.getItem('lang')]['FORM_BUTTON']; 
       this.avisolegal = this.translator_object[localStorage.getItem('lang')]['TIT_MODAL_AVISO']; 
       this.fecha = this.translator_object[localStorage.getItem('lang')]['TIT_MODAL_FECHA']; 
         console.log(this.item.title);
       


  }

  onPageWillLeave(){
    this.backButtonAction();
  }

  backButtonAction(){
    let alert = Alert.create({
      title: 'Atención',
      message: '¿Desea cancelar la moraga?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            //Do nothing
          }
        },
        {
          text: 'SI',
          handler: () => {
            this.nav.push(Inicio);
          }
        }
      ]
    });
    this.nav.present(alert);
  }


  onSubmit(){
    if(this.checkFields()){
      let loading = Loading.create({
        content: "Please wait..."
      });
      this.nav.present(loading);
      this.newMoraga.PlayaID = this.playa.id;
    this.newMoraga.Playa = this.playa.nombre;
      console.log(this.playa);
      let body = JSON.stringify(this.newMoraga);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://gecorsystem.com/ApiVelez/api/Moraga/',body,options).subscribe(res =>{
          console.log(res);
          loading.dismiss();
          let result = JSON.parse(res.text());
          if(result.rowsAffected > 0){
            let alert = Alert.create({
              title: 'Mensaje',
              message: 'Moraga solicitada correctamente',
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    //this.nav.pop();
                    this.nav.push(Inicio);
                  }
                }
              ]
            });
            this.nav.present(alert);
            
            /*this.showAlert("Mensaje", "Moraga solicitada correctamente" , "OK");
            this.nav.pop();*/
          }else{
            this.showAlert("ERROR", "No se ha podido solicitar la moraga. " + result.message , "OK");
          }
    })
    }
    
  }
  
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  checkDNI(dni: String){
    dni = dni.toUpperCase();
    if(dni.length !== 9){
      return false;
    }
    let letras = ['T','R','W','A','G','M','Y','F','P','D','X','B','N','J','Z','S','Q','V','H','L','C','K','E'];
    
    let regExp = /[XYZ0-9]/;
    
    if(!regExp.test(""+dni.charAt(0))){
      return false;
    }
    
    if(dni.charAt(0) === 'X'){
        dni = dni.replace('X','0');
      }else if(dni.charAt(0) === 'Y'){
        dni = dni.replace('Y','1');
      }else if(dni.charAt(0) === 'Z'){ 
        dni = dni.replace('Z','2');
      }
      
    let resto = parseInt(dni.substring(0,8)) % 23;
    if(dni.charAt(8) !== letras[resto]){
      return false;
    }
    
    return true;
  }
  
  checkCodPost(codPost){
    if(codPost.length !== 5){
      return false;
    }
    let filter = /^([0-5][0-9]*)|(AD[0-9]*)$/ // No es un filtro perfecto, pero evita algunos códigos postales falsos
    
    if(!filter.test(codPost)){
      return false;
    }
    return true;
  }
  
  checkEmail(email){
    let filter = /^[a-zA-Z_\-.0-9]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if(!filter.test(email)){
      return false;
    }
    return true;
  }
  checkTlfMovil(tlfMovil : string){
  
    if(tlfMovil.length !== 12){
      return false;
    }
    
    let filter = /^\+[0-9]*$/
    
    if(!filter.test(tlfMovil)){
      return false;
    }
    return true;
    
  }
  
  showAlert(title, subTitle, okButton){
    let alert = Alert.create({
      title: title,
      subTitle: subTitle,
      buttons: [okButton]
    });
    this.nav.present(alert);
  }
  

   
    
  checkFields(){
    let atencion = this.translator_object[localStorage.getItem('lang')]['ATENCION']; 
    if(!this.aviso){
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_AVISO'] , "OK");
      return false;
    }
    var ok = true;
    
    if (this.newMoraga.Nombre === ''){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_NOMBRE'], "OK");
      return ok;
    }
    if (this.newMoraga.Apellidos === ''){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_APELLIDOS'], "OK");
      return ok;
    }
    if (this.newMoraga.DNI === '' || !this.checkDNI(this.newMoraga.DNI)){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_DNI'], "OK");
      return ok;
    }
    if (this.newMoraga.CodPost === '' || !this.checkCodPost(this.newMoraga.CodPost)){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_CODPOST'], "OK");
      return ok;
    }
    if (this.newMoraga.Email === '' || !this.checkEmail(this.newMoraga.Email)){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_EMAIL'], "OK");
      return ok;
    }
    if (this.newMoraga.TlfMovil === '' || !this.checkTlfMovil(this.newMoraga.TlfMovil)){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_TELEFONO'], "OK");
      return ok;
    }
    if (this.newMoraga.Direccion === '' ){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_DIRECCION'], "OK");
      return ok;
    }
    if (this.newMoraga.NumAsistentes === '' ){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_NUM_ASIST'], "OK");
      return ok;
    } 
    if (this.fecha === '' ){
      ok = false;
      this.showAlert(atencion, this.translator_object[localStorage.getItem('lang')]['VALIDATE_DIA'], "OK");
      return ok;
    } 
   
    
    return ok;
  }
  
  openModal(mod) {
    if(mod === 'fecha'){
      let modal = Modal.create(ModalsContentPage,{
        "translator": this.translator_object[localStorage.getItem('lang')]
      });
      modal.onDismiss(data => {
      this.newMoraga.Dia = moment(data.fecha).format('L');
      });
       this.nav.present(modal,{
         
       });
    }else if(mod === 'aviso'){
      let modal = Modal.create(AvisoLegalPage);
      
       this.nav.present(modal);

    }
    
   
 


  }
}

@Page({
  templateUrl: './build/pages/lista/detalle/moraga/aviso-legal.html'
})

class AvisoLegalPage{
  private viewContainer: ViewContainerRef;
  private el: any;
  constructor(viewContainer: ViewContainerRef,public platform: Platform,public nav: NavController,
      public params: NavParams,
      public viewCtrl: ViewController) {
        this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
    
      }
  dismiss() {
    
    this.viewCtrl.dismiss();
  }
}

@Page({
  templateUrl: './build/pages/lista/detalle/moraga/modal-content.html'
})
class ModalsContentPage {
  //public isOpened: boolean;
  public dateValue: string;
  public viewValue: string;
  public days: any;//Array<Object>;
  public dayNames: Array<string>;
  private el: any;
  private date: any;
  private weeks: any;
  private viewContainer: ViewContainerRef;
  private onChange: Function;
  private onTouched: Function;
  private cannonical: number;
  private current: any;
  private firstWeekDay: any;
  private latestSelected: any;

  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  @Input('init-date') initDate: string;
  @Input('first-week-day-sunday') firstWeekDaySunday: boolean;
  @Input('static') isStatic: boolean;

  @Output() changed: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(viewContainer: ViewContainerRef,public platform: Platform,public nav: NavController,
      public params: NavParams,
      public viewCtrl: ViewController) {
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

    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
    this.init();
  }

  ngAfterViewInit() {
    console.log('initValue');
    this.initValue();
  }
  /*

  public openDatepicker(): void {
    this.isOpened = true;
  }

  public closeDatepicker(): void {
    this.isOpened = false;
  }

  */
  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date, undefined);
  }

  public prevMonth(selected): void {
    this.date.subtract(1,'M');
    this.generateCalendar(this.date, selected);
  }

  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date, undefined);
  }

  public nextMonth(selected): void {
    this.date.add(1,'M');
    this.generateCalendar(this.date, selected);
  }

  public selectDate(e, date): void {
    if(moment(date).startOf('day').diff(moment().startOf('day'),'days') <= 5){
      let alert = Alert.create({
        title: 'Error',
        message: this.params.get('translator')['VALIDATE_DIA'],
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
    }else{
      let selectedDate;
      console.log('selectDate');
      if(!date.isCurrentMonth){
        if(this.current.month < date.month){


          this.nextMonth(date);
          selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
        }
        else{


          this.prevMonth(date);
          selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
        }
      }else{

          if(this.latestSelected)
            this.latestSelected.selected = false;

          date.selected = true;
          this.latestSelected = date;

          e.preventDefault();
          if (this.isSelected(date)) return;
          selectedDate = moment(date.day + '.' + (date.month + 1) + '.' + date.year, 'DD.MM.YYYY');
          this.dismiss(selectedDate);
      }
    }





  }

  private generateCalendar(date, selectedDate): void {
    console.log('generateCalendar');
    this.current = {
      year: date.format('YYYY'),
      monthName: date.format('MMMM'),
      month: date.month()
    }
    let lastDayOfMonth = date.endOf('month').date();

    this.dateValue = date.format('MMMM YYYY');
    this.weeks = [];

    if (this.firstWeekDaySunday === true) {
      this.firstWeekDay = date.set('date', 2).day();
    } else {
      this.firstWeekDay = date.set('date', 1).day();
    }
      var done = false, dateClone = date.clone(), monthIndex = dateClone.month(), count = 0;
      while (!done) {
          this.weeks.push({ days: this._buildWeek(dateClone, date, selectedDate) });
          dateClone.add(1, "w");
          done = count++ > 2 && monthIndex !== dateClone.month();
          monthIndex = dateClone.month();
      }
      console.log(this.weeks);
  }

  private _buildWeek(date, month, selectedDate): any {
    console.log('_buildWeek');
      if(!selectedDate)
        selectedDate = {};

      this.days = [];

      if(date.day() != 0 && this.firstWeekDay){
        date.subtract(date.day()-1, "d");
      }else if(date.weekday() === 0){
        date.subtract(6, "d");
      }

      for (var i = 0; i < 7; i++) {
          this.days.push({
              name: date.format("dd").substring(0, 1),
              day: date.date(),
              month: date.month(),
              year: date.year(),
              isCurrentMonth: date.month() === month.month(),
              isToday: date.isSame(new Date(), "day"),
              selected: selectedDate.day == date.day() && selectedDate.month == date.month() && selectedDate.year == date.year() ? true : false,
              date: date
          });
          date = date.clone();
          date.add(1, "d");
          if(this.days[i].selected)
            this.latestSelected = this.days[i];
      }
      return this.days;

  }

  isSelected(date) {
    console.log('isSelected');
    let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
    return selectedDate.toDate().getTime() === this.cannonical;
  }

  private generateDayNames(): void {
    console.log('generateDayNames');
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('ddd'));
      date.add('1', 'd');
    }
  }

  private initMouseEvents(): void {
    console.log('initMouseEvents');
    let body = document.getElementsByTagName('body')[0];
    /*
    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeDatepicker();
      }
    }, false);
    */
  }

  private setValue(value: any): void {
    console.log('setValue');
    let val = moment(value, this.modelFormat || 'YYYY-MM-DD');
    this.viewValue = val.format(this.viewFormat || 'Do MMMM YYYY');
    //this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
    this.cannonical = val.toDate().getTime();
  }

  private initValue(): void {
    console.log('initValue');
    setTimeout(() => {
      if (!this.initDate) {
        this.setValue(moment().format(this.modelFormat || 'YYYY-MM-DD'));
      } else {
        this.setValue(moment(this.initDate, this.modelFormat || 'YYYY-MM-DD'));
      }
    });
  }

  /*

  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  */

  private checkDate(day): string {
    let classes = '';
    if(day.isCurrentMonth)
      classes += ' actual-month';
    if(day.isToday)
      classes += ' current';

    return classes;
  }

  private init(): void {
    console.log('init');
    this.date = moment();
    this.firstWeekDaySunday = false;
    this.generateDayNames();
    this.generateCalendar(this.date, undefined);
    //this.initMouseEvents();
  }

  dismiss(selectedDate) {
    console.log(selectedDate);
    let data = { 'fecha': selectedDate};
    this.viewCtrl.dismiss(data);
  }

}
