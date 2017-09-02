import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';

@Component({
    selector: 'submit-page',
    templateUrl: 'submit-data.html'
})

export class SubmitDataPage {
    ref: any;
    app: any;
    db: any;

    constructor(public navCtrl: NavController) {
        this.app = firebase.initializeApp(FIREBASE_CONFIG);
        this.db = this.app.database();
        this.ref = this.db.ref("dataPoints");
    }

    ionViewDidLoad() {

    }

    onSubmit(formData) {
        console.log(formData);
        this.ref.set(formData);
    }

}
