/// <reference path="../../../../../typings/tsd.d.ts"/>

import {Page, NavController, NavParams,Modal,Platform,ViewController,Alert} from 'ionic-angular';
import {Parser} from '../../../../providers/parser';
import {Translator} from '../../../../providers/translator';
import {Events} from 'ionic-angular';
import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit, NgZone} from '@angular/core';
import {NgIf, NgFor, NgClass, NgModel, FORM_DIRECTIVES, ControlValueAccessor} from '@angular/common';
import * as moment_ from 'moment';
import {Http,Headers, RequestOptions} from '@angular/http';
const moment: moment.MomentStatic = (<any>moment_)['default'] || moment_;

@Page({
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
  constructor(private nav: NavController,
     private params : NavParams,
     private parser: Parser,
     private translator: Translator,
     private _ngZone: NgZone,
     private http: Http,
     public events: Events) {
       this.item = params.get('item');
       this.playa = params.get('playa');
       translator.load().then(data =>{
         this.tit = data[localStorage.getItem('lang')]['MORAGA'];

         console.log(this.item.title);
       });


  }


  onSubmit(){

    this.newMoraga.PlayaID = this.playa.id;
    this.newMoraga.Playa = this.playa.nombre;
      console.log(this.playa);
      let body = JSON.stringify(this.newMoraga);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://192.168.1.125/ApiVelez/api/Moraga/',body,options).subscribe(res =>{
    })
  }
  openModal() {
    let modal = Modal.create(ModalsContentPage);
   modal.onDismiss(data => {
     this.newMoraga.Dia = moment(data.fecha).format('L');

   });
   this.nav.present(modal);


  }
}
@Page({
  templateUrl: './build/pages/lista/detalle/moraga/modal-content.html'
})
class ModalsContentPage {
  //public isOpened: boolean;
  public dateValue: string;
  public viewValue: string;
  public days: Array<Object>;
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
        },
        ordinalParse : /\d{1,2}º/,
        ordinal : '%dº'/*,
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }*/
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
        message: "La fecha debe ser posterior a 5 días desde hoy",
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
              selected: selectedDate.day == date.date() && selectedDate.month == date.month() && selectedDate.year == date.year() ? true : false,
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
    let data = { 'fecha': selectedDate};
    this.viewCtrl.dismiss(data);
  }

}