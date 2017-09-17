import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';


import { HomePage } from '../pages/home/home';
import { MapPage }  from '../pages/map/map';
import {LoginPage} from '../pages/login/login';
import {ExplorePage} from "../pages/explore/explore";
import { SubmitDataLandingPage } from '../pages/submit-data-landing/submit-data-landing';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any;

    pages: Array<{title: string, icon: string, component: any}>;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            {
                title: 'Map',
                icon: 'map',
                component: MapPage
            },
            {
                title: 'Explore',
                icon: 'search',
                component: ExplorePage
            },
            {
                title: 'Submit',
                icon: 'send',
                component: SubmitDataLandingPage
            },
            {
                title: 'Admin',
                icon: 'person',
                component: LoginPage
            }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.rootPage = MapPage;

            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

}
