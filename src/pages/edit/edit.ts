import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { PurchasesPage } from '../purchases/purchases';




@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  id: any;
  item_name: any;
  total: any;
  qty: any;
  price: any;


  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private sqlite: SQLite) {
    this.item = navParams.get('item');


    console.log('loloooooooooooooooo' + this.item)

    this.id = this.item.id;
    this.total = this.item.total;
    this.qty = this.item.qty;
    this.price = this.item.price;
    this.item_name = this.item.item_name;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  update() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        ////////ادخال قيم//////
        this.total = this.qty * this.price;

        db.executeSql('UPDATE sales_item set total=? , qty=? WHERE id=?', [
          this.total,
          this.qty,
          this.id
        ])
          .then(() => {
            console.log(this.total);
            console.log('Executed SQL insert');
            this.navCtrl.push('PurchasesPage')
          })
          .catch(e => console.log(e));
      }).catch(e => console.log(e));
  }


  minus() {
    if (this.qty == 1) {
      return;
    }
    this.qty--;
    this.total = this.qty * this.price;
  }
  plus() {
    this.qty++;
    this.total = this.qty * this.price;
  }


  closeModal() {
    // this.viewCtrl.dismiss();
    this.navCtrl.push('PurchasesPage')
  }
}
