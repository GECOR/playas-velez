import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';


@Injectable()
export class Banderas {
  data: any;

  constructor(private http: Http) {}

  load() {

      return new Promise(resolve => {

        if(localStorage.getItem('online') === "false"){
          resolve(JSON.parse(localStorage.getItem('banderas')));
        }else{


          this.http.get('http://192.168.1.125/ApiVelez/api/Data/estados',null).subscribe(res => {

            this.data = this.processResponse(res.json());
            console.log(this.data);


            resolve(this.data);
          });
        }
      });
  }

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

  getEstados(){
    return this.load().then(data =>{
      return data.playas;
    })
  }
  banderaParaEstado(estado){
    return 'img/'+ estado + ".png";
  }

}
