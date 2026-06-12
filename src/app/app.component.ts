import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { ReplaySubject } from "rxjs/ReplaySubject";
// import { ArrayObservable } from "rxjs/observable/ArrayObservable";

import { Nav, Platform, MenuController, AlertController, LoadingController } from 'ionic-angular';

// Models
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content';
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { MenuOptionModel } from './../shared/side-menu-content/models/menu-option-model';

import { Storage } from '@ionic/storage';
import { GlobalvarProvider } from '../providers/globalvar/globalvar';


import { SplashScreen } from '@ionic-native/splash-screen';

declare let BTPrinter: any;

@Component({
  templateUrl: 'app.html',
  encapsulation: ViewEncapsulation.None
})
export class MyApp {
  tabBarElement: any;

  splash = true;

  path_image: string = "assets/imgs/logo.png"
  company_name: string;
  Database_name: string;
  Printer_name: string;
  number_copies: number = 1;

  loading: any;

  @ViewChild(Nav) navCtrl: Nav;

  // Get the instance to call the public methods
  @ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;


  public rootPage: any = 'LoginPage';

  // Options to show in the SideMenuComponent
  public options: Array<MenuOptionModel>;

  // Settings for the SideMenuComponent
  public sideMenuSettings: SideMenuSettings = {
    accordionMode: true,
    showSelectedOption: true,
    selectedOptionClass: 'my-selected-option',
    subOptionIndentation: {
      md: '56px',
      ios: '64px',
      wp: '56px'
    }
  };

  private unreadCountObservable: any = new ReplaySubject<number>(0);

  constructor(private platform: Platform,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    public storage: Storage,
    public globalvar: GlobalvarProvider,
    public loadingCtrl: LoadingController,
    private splashScreen: SplashScreen) {
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        // statusBar.styleDefault();
        splashScreen.hide();
      });




    this.tabBarElement = document.querySelector('.tabbar');



    ////////////////////////////////////////////
    this.storage.get('company_name').then((val) => {
      this.globalvar.company_name = val;
      console.log('Database_name' + ' : ' + val)
    })

    this.storage.get('company_name_2').then((val) => {
      this.globalvar.company_name_2 = val;
      console.log('company_name_2' + ' : ' + val)
    })

    this.storage.get('number_copies').then((val) => {
      this.globalvar.number_copies = val;
      console.log('number_copies' + ' : ' + val)
    })

    this.storage.get('image').then((val) => {
      this.globalvar.path_image = val;
      console.log('image' + ' : ' + val)
    })

    this.storage.get('add_tax_button').then((val) => {
      this.globalvar.add_tax = val;
      console.log('add_tax_button'+ ' : ' + val)
    })

    this.storage.get('vat_id').then((val) => {
      this.globalvar.vat_id = val;
      console.log('vat_id' + ' : ' + val)
    })

    this.storage.get('line_1').then((val) => {
      this.globalvar.line_1 = val;
      console.log('line_1' + ' : ' + val)
    })

    this.storage.get('line_2').then((val) => {
      this.globalvar.line_2 = val;
      console.log('line_2' + ' : ' + val)
    })

    this.globalvar.user_login = 'admin'
    ////////////////////////////////////////////

    this.tabBarElement = 'none';
    setTimeout(() => {
      this.splash = false;
      this.tabBarElement = 'flex';
    }, 4000);
    this.splashScreen.show();





    this.initializeApp();
    // this.print_status()
  }





  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    setTimeout(() => {
      this.splash = false;
      console.log(this.splash + ';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;')
      this.tabBarElement.style.display = 'flex';
    }, 4000);
  }




  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize some options
      this.initializeOptions();
    });

    // Change the value for the batch every 5 seconds
    setInterval(() => {
      this.unreadCountObservable.next(Math.floor(Math.random() * 10));
    }, 5000);
  }

  private initializeOptions(): void {
    this.options = new Array<MenuOptionModel>();

    // ------------------------------------------
    this.options.push({
      iconName: 'home',
      displayName: 'Home',
      component: 'HomePage',

      // This option is already selected
      selected: true
    });
    //---------------------------------------------
    this.options.push({
      displayName: 'Table System',
      subItems: [
        {
          iconName: 'people',
          displayName: 'Group',
          component: 'GroupPage'
        },
        {
          iconName: 'information',
          displayName: 'Items',
          component: 'ItemsPage'
        },
        {
          iconName: 'contacts',
          displayName: 'Users',
          component: 'UsersPage'
        }
      ]
    });
    //---------------------------------------------

    //---------------------------------------------
    this.options.push({
      displayName: 'Reports',
      subItems: [
        {
          iconName: 'list-box',
          displayName: 'Total Sales',
          component: 'TotalSalesPage'
        },
        {
          iconName: 'list',
          displayName: 'Details Sales',
          component: 'DetailsSalesPage'
        }
        ,
        {
          iconName: 'filing',
          displayName: 'Sales By Group',
          component: 'SalesByGroupPage'
        },
        {
          iconName: 'beaker',
          displayName: 'Details Refund',
          component: 'DetailsRefundPage'
        }
      ]
    });
    //---------------------------------------------

    // this.options.push({
    //   iconName: 'albums',
    //   displayName: 'Reports',
    //   component: ReportsPage
    // });


    //---------------------------------------------
    this.options.push({
      displayName: 'Operations',
      subItems: [
        {
          iconName: 'filing',
          displayName: 'History',
          component: 'HistoryPage'
        },
        {
          iconName: 'albums',
          displayName: 'Refund',
          component: 'RefundPage'
        }
        
      ]
    });

    //---------------------------------------------

    this.options.push({
      iconName: 'settings',
      displayName: 'Setting',
      component: 'SettingPage'
    });

  }

  public selectOption(option: MenuOptionModel): void {

    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.menuCtrl.close().then(() => {

      console.log('111111111111111111')
      // this.navCtrl.setRoot(option.component || 'TableSystemPage', { 'title': option.displayName });
      this.navCtrl.setRoot(option.component);
      this.loading.dismiss();


    });

  }


  public collapseMenuOptions(): void {
    // Collapse all the options
    this.sideMenu.collapseAllOptions();
  }

  // public presentAlert(message: string): void {
  //   let alert = this.alertCtrl.create({
  //     title: 'Information',
  //     message: message,
  //     buttons: ['Ok']
  //   });
  //   alert.present();
  // }

}
