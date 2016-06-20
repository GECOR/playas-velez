import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

/*********************************
 * 
 * ESTA CLASE OBTIENE DEL SERVIDOR LOS DATOS
 * RELATIVOS AL ESTADO DE LAS PLAYAS
 * 
 */

@Injectable()
export class Banderas {
  data: any;

  constructor(private http: Http) {}

  load() {

      return new Promise(resolve => {
       // Si el usuario no quiere utilizar datos móviles
        if(localStorage.getItem('online') === "false"){
          resolve(JSON.parse(localStorage.getItem('banderas')));
        }else{
          // Si quiere los pedimos al servidor

          this.http.get('http://gecorsystem.com/ApiVelez/api/Data/estados',null).subscribe(res => {

            this.data = this.processResponse(res.json());
            console.log(this.data);


            resolve(this.data);
          });
        }
      });
  }
  
    // Crea la estructura JSON que vamos a utilizar y la inserta en localStorage

    processResponse(json){
   this.data = {playas:[]};
   let obj = 0;


   for (var i = 0; i < json.length; i = i + 6) {
    // Iterate over numeric indexes from 0 to 5, as everyone expects.
     this.data.playas.push({id: json[0+i],nombre: json[1+i],estado: json[2+i],fecha: json[3+i],idItem:json[5+i],bandera:this.banderaParaEstado(json[2+i])});
   }
   console.log("data",this.data);
   localStorage.setItem('banderas',JSON.stringify(this.data));
   return this.data;
  }
  
  // Obtiene los estados del JSON

  getEstados(){
    return this.load().then((data: { playas: any; }) =>{
      return data.playas;
    })
  }
  
  // Devuelve la ruta a la imagen de la bandera
  
  banderaParaEstado(estado){
    return 'img/'+ estado + ".png";
  }

}
