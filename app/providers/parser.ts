import {Injectable} from '@angular/core';
import {Http} from '@angular/http';


@Injectable()
export class Parser {
  data: any;

  constructor(private http: Http) {}

  load() {

      return new Promise(resolve => {

        if(localStorage.getItem('online') === "false"){
          resolve(JSON.parse(localStorage.getItem('data')));
        }else{


          this.http.get('http://gecorsystem.com/ApiVelez/api/Data/').subscribe(res => {

            this.data = this.processData(res.json());
            console.log("typeitems",this.data);
            localStorage.setItem('data',JSON.stringify(this.data));

            resolve(this.data);
          });
        }
      });



  }

  itemsForTypeItem(idTypeItem){

    return function(item){
      return item.idTypeItem === idTypeItem;
    }
  }

  childForItem(idItem){
    return function(child){
      return child.idItem === idItem;
    }
  }


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
    //console.log(data);
    //console.log( data);
    return data;

  }

  processItem(data,item){

    item.images = data.images.filter(this.childForItem(item.idItem));
    item.offers = data.offers.filter(this.childForItem(item.idItem));
    item.coordinates = data.coordinates.filter(this.childForItem(item.idItem));
    item.dates = data.dates.filter(this.childForItem(item.idItem));
  }

  getTypeItems(){
    return this.load().then(data => {
      //console.log(data.typeItems);
      return data.typeItems;
    });
  }

  getItems(typeItems,index){
  

      return typeItems[index].items;
  }
}
