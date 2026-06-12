import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// https://github.com/CesarBalzer/Cordova-Plugin-BTPrinter/
// https://github.com/srehanuddin/Cordova-Plugin-Bluetooth-Printer/issues
// cordova-plugin-printer

@IonicPage()
@Component({
  selector: 'page-printer-list-modal',
  templateUrl: 'printer-list-modal.html',
})
export class PrinterListModalPage {
  printerList: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterListModalPage');
    this.printerList = this.navParams.get('data');
  }

  select(data) {
    this.viewCtrl.dismiss(data);
  }
}
