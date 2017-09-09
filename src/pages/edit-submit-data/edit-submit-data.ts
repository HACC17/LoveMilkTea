import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'edit-submit-page',
    templateUrl: 'edit-submit-data.html'
})

export class EditSubmitDataPage {
    ref: any;
    childRef: any;
    App: any;
    db: any;
    latitude: any;
    longitude: any;
    loader: any;

    constructor(public navCtrl: NavController, public loading: LoadingController, private toast: ToastController) {
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
        // for (var element in formData.value) {
        //     if(formData.value[element] === undefined){
        //         formData.value[element] = "n/a";
        //     }
        // }

        // Object.assign(formData.value, {'status': 'pending'});
        // this.childRef = this.ref.push();
        // this.childRef.set(formData.value);
        // console.log(formData.value);
        this.toast.create({
            message: `Edit complete`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot('AdminPage');
    }

    // Uses HTML5 navigator to get lat/long

}
