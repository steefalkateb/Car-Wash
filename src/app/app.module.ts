import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Custom components
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content';
import { IonicStorageModule } from '@ionic/storage';
import { GlobalvarProvider } from '../providers/globalvar/globalvar';
import { HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { firebaseConfig } from './firebase.credentials';
import { WashService } from '../services/wash.service';

import { Camera } from '@ionic-native/camera';

import { DatePipe } from '@angular/common';
import { test } from './../services/test';

import { SplashScreen } from '@ionic-native/splash-screen';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@NgModule({
  declarations: [
    MyApp,
    SideMenuContentComponent
  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
 
    ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],

  providers: [
    // { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalvarProvider,
    WashService,
    Camera,
    SQLite,
    DatePipe,
    test,
    SplashScreen,
    BluetoothSerial
  ]
})
export class AppModule { }
