import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'submit-page',
    templateUrl: 'submit-data.html'
})

export class SubmitDataPage {
    ref: any;
    childRef: any;
    App: any;
    db: any;
    myForm: NgForm;

    constructor(public navCtrl: NavController) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("dataPoints");
    }

    ionViewDidLoad() {

    }

    onSubmit(formData: NgForm) {
        this.childRef = this.ref.push();
        this.childRef.set(formData.value);
        console.log(formData.value);
        this.myForm = formData;
    }

}
