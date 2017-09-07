import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpModule} from '@angular/http';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {MapPage} from '../pages/map/map';
import {LoginPage} from "../pages/login/login";
import {SubmitDataPage} from "../pages/submit-data/submit-data";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {ExplorePage} from "../pages/explore/explore";

import {FIREBASE_CONFIG} from "../app.firebase.config";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        MyApp,
        MapPage,
        LoginPage,
        ExplorePage,
        SubmitDataPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        MapPage,
        LoginPage,
        ExplorePage,
        SubmitDataPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
