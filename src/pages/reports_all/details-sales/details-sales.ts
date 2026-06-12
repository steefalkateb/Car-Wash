import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';

@IonicPage()
@Component({
  selector: 'page-details-sales',
  templateUrl: 'details-sales.html',
})
export class DetailsSalesPage {

  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json
  tablestyle = 'bootstrap';
  sales_item: any = {}

  total: number = 0;
  total_qty: number = 0;
  Count_Rows: number = 0;

  sales_item$: Observable<any[]>;

  event1 = { startTime: new Date().toISOString(), allDay: false };
  event2 = { endTime: new Date().toISOString(), allDay: false };

  loading: any;

  total_page: boolean = false;
  color: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController) {


    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event1.startTime = preselectedDate;
    this.event2.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailedSalesPage');
  }

  view() {

    this.Count_Rows = 0

    this.total = 0;
    this.total_qty = 0;

    console.log(this.event1.startTime)
    console.log(this.event2.endTime)
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    // https://www.epochconverter.com/

    this.total_page = true


    console.log(this.total_page)

    var date = new Date(this.event1.startTime);
    date.setHours(0, 0, 0, 0);

    // var unixtime_startTime = new Date(date).getTime() / 1000;
    var unixtime_startTime = new Date(date).getTime();

    var date_end = new Date(this.event2.endTime);
    date_end.setHours(23, 59, 59, 59);


    // var unixtime_endTime = Math.floor(new Date(date_end).getTime() / 1000);
    var unixtime_endTime = Math.floor(new Date(date_end).getTime());

    // console.log(date)
    // console.log(date_end)

    console.log(unixtime_startTime)
    console.log(unixtime_endTime)

    this.sales_item$ = this.db.collection<any>(this.globalvar.company_name + '_sales_item',
      ref => ref.where('unix', '>=', Number(unixtime_startTime))
        .where('unix', '<=', Number(unixtime_endTime))).valueChanges();



    this.sales_item$.subscribe(data => {
      data.forEach(item => {
        this.total += Number(item.total);
        this.total_qty += Number(item.qty);
        this.Count_Rows += 1
        // console.log(item.total);
      });

    })
    this.loading.dismiss();


  }

  print() {

  }
  pdf() {

  }
  //////////////////////////////////Table/////////////////////////////////////////////////
  // https://devdactic.com/ionic-datatable-ngx-datatable/
  switchStyle() {
    //  // https://devdactic.com/ionic-datatable-ngx-datatable/
    //  if (this.tablestyle == 'dark') {
    //    this.tablestyle = 'bootstrap';
    //  } else {
    //    this.tablestyle = 'dark';
    //  }

    if (this.color == false) {
      this.color = true;
    }
      else if (this.color== true) {
      this.color = false;
    }

    console.log(this.color)
  }
  //////////////////////////////////Table/////////////////////////////////////////////////

}
