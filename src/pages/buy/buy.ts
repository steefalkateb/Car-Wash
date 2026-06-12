import { GlobalvarProvider } from './../../providers/globalvar/globalvar';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { Item } from '../../services/wash.service';
import { Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export interface Item {
  key?: string;
  name: string;
  price: string;
  cost: string;
  groupname: string;
  time_stamp: any;
}

@IonicPage()
@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
})
export class BuyPage {

  buy: Item = {
    name: null,
    price: null,
    cost: null,
    groupname: null,
    time_stamp: null,
    image:null
  };

  qty_buy: number;
  total_buy: number;

  id: any;
  item_name: any;
  qty: any;
  price: any;
  total: any;
  group_name: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public modlCtrl: ModalController,
    private sqlite: SQLite, public globalvar: GlobalvarProvider,
    public events: Events) {

    // this.globalvar.count_cart = 0;

    this.buy = this.navParams.get('keyitem');
    console.log(this.buy);
    this.qty_buy = 1;
    this.total_buy = this.qty_buy * this.buy.price;

  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  minus() {
    if (this.qty_buy == 1) {
      return;
    }
    // this.globalvar.count_cart = this.qty_buy--;
    this.qty_buy--;
    this.total_buy = this.qty_buy * this.buy.price;
  }
  plus() {
    this.qty_buy++;
    //  this.globalvar.count_cart = this.qty_buy++
    this.total_buy = this.qty_buy * this.buy.price;
  }

  ok() {
    // const modal = this.modlCtrl.create(PurchasesPage);
    // modal.present();
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        ////////ادخال قيم//////
        db.executeSql('INSERT INTO sales_item VALUES(NULL,?,?,?,?,?)',
          //  ['item', 'qty', 'price', 'total', 'group_name']

          [
            this.item_name = this.buy.name,
            this.qty = this.qty_buy,
            this.price = this.buy.price,
            this.total = this.total_buy,
            this.group_name = this.buy.groupname

          ])

          .then(() => {
            // console.log('Executed SQL insert');
            this.events.publish('RefreshPage','lolo');
            this.viewCtrl.dismiss();
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
  }

}
