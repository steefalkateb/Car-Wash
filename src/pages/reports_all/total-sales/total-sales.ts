import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import * as moment from 'moment';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { GlobalvarProvider } from '../../../providers/globalvar/globalvar';


@IonicPage()
@Component({
  selector: 'page-total-sales',
  templateUrl: 'total-sales.html',
})
export class TotalSalesPage {
  // https://github.com/swimlane/ngx-datatable/blob/master/assets/data/company.json

  // @ViewChild('aaa') table;

  tablestyle = 'bootstrap';
  Date_arr = new Array();
  sales: any = {}
  sales$: Observable<any[]>;
  uuu$: Observable<any[]>;

  event1 = { startTime: new Date().toISOString(), allDay: false };
  event2 = { endTime: new Date().toISOString(), allDay: false };
  code_number: any;
  index: number;
  loading: any;

  total: number = 0;
  sub: number = 0;
  tax: number = 0;
  Count_Rows: number = 0;
  total_page: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore, public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController) {


    this.globalvar.company_name
    console.log(this.globalvar.company_name
    )

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event1.startTime = preselectedDate;
    this.event2.endTime = preselectedDate;


    var date = new Date(this.event1.startTime);
    date.setHours(0, 0, 0, 0);
    var unixtime_startTime = new Date(date).getTime();


    // console.log(unixtime_startTime)

    var date_end = new Date(this.event1.startTime);
    date_end.setHours(23, 59, 59, 59);

    var unixtime_endTime = Math.floor(new Date(date_end).getTime());


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TotalSalesPage');
    // // https://www.epochconverter.com/
    // var date = new Date(this.event1.startTime);
    // date.setHours(0, 0, 0, 0);

    // var unixtime_startTime = new Date(date).getTime();

    // var date_end = new Date(this.event2.endTime);
    // date_end.setHours(23, 59, 59, 59);

    // var unixtime_endTime = Math.floor(new Date(date_end).getTime());

    // console.log(date)
    // console.log(date_end)

    // console.log(unixtime_startTime)
    // console.log(unixtime_endTime)


    // console.log(this.Date_arr)


    //   this.sales$ = this.db.collection<any>(this.globalvar.company_name + '_sales',
    //     ref => ref.where('unix', '>=', Number(this.Date_arr[i].start))
    //       .where('unix', '<=', Number(this.Date_arr[i].end))).valueChanges();



    // if (date_start.getTime() != date_end.getTime()) {
    //   console.log('kkkkk')
    // }
    //   this.uuu$ = this.db.collection<any>('M_sales').valueChanges();


    //   for (let index = 0; index < this.Date_arr.length; index++) {
    //     this.give_data(index)
    //   }
    //   console.log(this.Date_arr)
    // }

    // this.uuu$ = this.db.collection<any>('M_sales').valueChanges();
    // this.uuu$ = this.db.collection<any>(this.globalvar.company_name + '_sales', ref => ref
    //   .where('unix', '>=', Number(this.Date_arr[0].start))
    //   .where('unix', '<=', Number(this.Date_arr[this.Date_arr.length - 1].end)))
    //   .valueChanges();

  }

  async view() {

    this.Count_Rows = 0

    this.total = 0;
    this.sub = 0;
    this.tax = 0;

    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.total_page = true

    var date_start: Date = new Date(this.event1.startTime);
    date_start.setHours(0, 0, 0, 0);

    var date_end: Date = new Date(this.event2.endTime);
    date_end.setHours(0, 0, 0, 0);

    var date_start_end: Date = new Date(this.event1.startTime);
    date_start_end.setHours(23, 59, 59, 59);


    var unixtime = Math.floor(new Date(date_start).getTime())
    var unixtime_end = Math.floor(new Date(date_start_end).getTime())

    this.Date_arr = [];



    while (date_start.getTime() <= date_end.getTime()) {

      this.Date_arr.push({
        start: unixtime,
        end: unixtime_end,
        total: '0',
        subtotal: '0',
        tax: '0'
      })

      date_start.setHours(24);
      unixtime = unixtime + (1000 * 60 * 60 * 24)
      unixtime_end = unixtime_end + (1000 * 60 * 60 * 24)
    }

    this.uuu$ = this.db.collection<any>(this.globalvar.company_name + '_sales', ref => ref
      .where('unix', '>=', Number(this.Date_arr[0].start))
      .where('unix', '<=', Number(this.Date_arr[this.Date_arr.length - 1].end)))
      .valueChanges();


    // console.log(this.Date_arr[0].start)
    // console.log(this.Date_arr[this.Date_arr.length - 1].end)

    for (this.index = 0; this.index < this.Date_arr.length; this.index++) {

      await this.give_data(this.index)

    }
    console.log('start : ' + this.Date_arr[0].start)

    console.log('end : ' + this.Date_arr[this.Date_arr.length - 1].end)

    this.loading.dismiss();

  }
  give_data(index: number) {

    this.uuu$.subscribe(result => {
      var total: number = 0
      var subtotal: number = 0
      var tax: number = 0

      total = 0
      subtotal = 0
      tax = 0
      result.map(data => {

        if (data.unix >= this.Date_arr[index].start && data.unix <= this.Date_arr[index].end) {

          total = total + Number(data.total)
          subtotal = subtotal + Number(data.subtotal)
          tax = tax + Number(data.tax)

        }

        // console.log(data)
        // console.log(data.total)

      })


      this.Date_arr[index].total = total;
      this.Date_arr[index].subtotal = subtotal;
      this.Date_arr[index].tax = tax;



      this.total = this.total + this.Date_arr[index].total
      this.sub = this.sub + this.Date_arr[index].subtotal
      this.tax = this.tax + this.Date_arr[index].tax
      this.Count_Rows += 1


    });

    // console.log(this.Date_arr[index].total)

  }
  print() {
    // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_print
    // http://jsfiddle.net/Q5Xc9/1/

    // https://stackblitz.com/edit/angular-printing-solution
    window.print();

    console.log('kjjhuhuhhhuhuhhu')
  }
  pdf() {

  }
  //////////////////////////////////Table/////////////////////////////////////////////////
  // https://devdactic.com/ionic-datatable-ngx-datatable/
  switchStyle() {
    // https://devdactic.com/ionic-datatable-ngx-datatable/
    if (this.tablestyle == 'dark') {
      this.tablestyle = 'bootstrap';
    } else {
      this.tablestyle = 'dark';
    }
  }

  //////////////////////////////////Table/////////////////////////////////////////////////
  //   this.uuu$ = this.db.collection<any>('M_sales' ).valueChanges();

  //   var index: number;

  //   for (index = 0; index < this.Date_arr.length; index++) {
  //     this.give_data(index)

  //   }
  //   console.log(this.Date_arr)

  // }

  // give_data(index: number) {
  //   var total: number = 0
  //     this.uuu$.subscribe(result => {
  //       result.map(data => {
  //         if (data.total == index + 1) {
  //           total = total + Number(data.total)
  //         }
  //       })
  //       this.Date_arr[index].total = total;
  //     });
  // }
}

