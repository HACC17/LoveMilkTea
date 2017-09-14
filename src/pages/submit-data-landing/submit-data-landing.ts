import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';import {Http} from '@angular/http';
import {SubmitDataPage} from "../submit-data/submit-data";
import {SubmitDataChooseCoordsPage} from "../submit-data-choose-coords/submit-data-choose-coords";

@Component({
    selector: 'submit-data-landing-page',
    templateUrl: 'submit-data-landing.html'
})

export class SubmitDataLandingPage {
    token: any;

    constructor(public navCtrl: NavController, public loading: LoadingController, private toast: ToastController, public http: Http) {

    }

    ionViewDidLoad() {

    }
    goMainPage(){
        this.token = ({'token': true});
        this.navCtrl.push(SubmitDataPage, this.token);
    }

    goMap(){
        this.navCtrl.push(SubmitDataChooseCoordsPage);
    }

}
