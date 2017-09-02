import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {MapPage} from '../pages/map/map';
import {LoginPage} from "../pages/login/login";
import {SubmitDataPage} from "../pages/submit-data/submit-data";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {FIREBASE_CONFIG} from "./../app.firebase.config";


@NgModule({
    declarations: [
        MyApp,
        ListPage,
        MapPage,
        LoginPage,
        SubmitDataPage,

    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ListPage,
        MapPage,
        LoginPage,
        SubmitDataPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
