import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

/******************************************
 * ESTA CLASE LEE EL ARCHIVO DONDE ESTÁN LAS 
 * TRADUCCIONES DE LA APLICIÓN
 * TODAS LAS TRADUCCIONES DEBEN CREARSE AQUÍ
 * SI ES UN TYPEITEM, DEBE ESTAR EN BASE DE DATOS
 * 
 * SE PODRÍAN METER ESTAS TRADUCCIONES EN BASE DE DATOS
 * CREANDO UNA COLUMNA POR CADA IDIOMA
 */

@Injectable()
export class Translator {
  translator: any;

  constructor(private http: Http) {}

  load() {
    if (this.translator) {
      // already loaded data
      return Promise.resolve(this.translator);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('assets/i18n/translate.json').subscribe(res => {
        // we've got back the raw data, now generate the core schedule data
        // and save the data for later reference
        this.translator = res.json();
        resolve(this.translator);
      });
    });
  }
}
