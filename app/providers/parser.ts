import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

/************************************
 * 
 * ESTA CLASE OBTIENE LOS DATOS DE LOS ITEMS
 * 
 * 
 */

@Injectable()
export class Parser {
  data: any;

  constructor(private http: Http) {}

  load() {

      return new Promise(resolve => {
        // Si el usuario no quiere utilizar datos móviles
        if(localStorage.getItem('online') === "false"){
          resolve(JSON.parse(localStorage.getItem('data')));
        }else{
        // Si quiere utilizar datos móviles, pedimos los datos al servicio

          this.http.get('http://gecorsystem.com/ApiVelez/api/Data/').subscribe(res => {

            this.data = this.processData(res.json());
            console.log("typeitems",this.data);
            
            localStorage.setItem('data',JSON.stringify(this.data));

            resolve(this.data);
          });
        }
      });



  }
  
  // filtra los items un determinado typeItem

  itemsForTypeItem(idTypeItem){

    return function(item){
      return item.idTypeItem === idTypeItem;
    }
  }
  
  // filtra images,coordinates,dates,etc de un determinado item

  childForItem(idItem){
    return function(child){
      return child.idItem === idItem;
    }
  }
  
  // Crea la estructura JSON con la que trabajaremos

  processData(data){

    // Fill typeItems with items

    data.typeItems.forEach(typeItem =>{

      typeItem.items = data.items.filter(this.itemsForTypeItem(typeItem.idTypeItem));

      typeItem.items.forEach(item => {

        this.processItem(data,item);

      })
    });

    // Remove previous structure of json

    delete(data.items);
    delete(data.offers);
    delete(data.coordinates);
    delete(data.images);
    delete(data.dates);
  
    return data;

  }
  
  // Inserta en items las images,offers,coordinates, dates

  processItem(data,item){

    item.images = data.images.filter(this.childForItem(item.idItem));
    item.offers = data.offers.filter(this.childForItem(item.idItem));
    item.coordinates = data.coordinates.filter(this.childForItem(item.idItem));
    item.dates = data.dates.filter(this.childForItem(item.idItem));
  }
  
  // Extrae los typeItems del JSON
  getTypeItems(){
    return this.load().then((data: { typeItems: any; }) => {
      //console.log(data.typeItems);
      return data.typeItems;
    });
  }
  
  // Obtiene los items tomando como identificador la sección que se pulsa en el menú

  getItems(typeItems,index){
  

      return typeItems[index].items;
  }
}
