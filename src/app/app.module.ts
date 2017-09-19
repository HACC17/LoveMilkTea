import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { App } from './app.component';
import { MapPage } from '../pages/map/map';
import { LoginPage } from "../pages/login/login";
import { SubmitDataPage } from "../pages/submit-data/submit-data";
import { SubmitDataChooseCoordsPage } from "../pages/submit-data-choose-coords/submit-data-choose-coords";
import { ExplorePage } from "../pages/explore/explore";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { FIREBASE_CONFIG } from "../app.firebase.config";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SubmitDataLandingPage } from "../pages/submit-data-landing/submit-data-landing";

import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
    declarations: [
        App,
        MapPage,
        LoginPage,
        ExplorePage,
        SubmitDataLandingPage,
        SubmitDataPage,
        SubmitDataChooseCoordsPage,
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(App),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        MapPage,
        LoginPage,
        ExplorePage,
        SubmitDataLandingPage,
        SubmitDataPage,
        SubmitDataChooseCoordsPage
    ],
    providers: [
        Geolocation,
        StatusBar,
        SplashScreen,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})
export class AppModule {}
