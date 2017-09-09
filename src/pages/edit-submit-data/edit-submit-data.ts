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
    App: any;
    db: any;
    latitude: any;
    longitude: any;
    pointName: string;
    address: string;
    description: string;
    email: string;
    phone: string;
    type: string;
    website: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("dataPoints");

        //set values to repopulate form
        this.pointName = this.navParams.get('pointName');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');
        this.address = this.navParams.get('address');
        this.description = this.navParams.get('description');
        this.phone = this.navParams.get('phone');
        this.type = this.navParams.get('type');
        this.email = this.navParams.get('email');
        this.website = this.navParams.get('website');

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
        this.navCtrl.pop();
    }

    // Uses HTML5 navigator to get lat/long

}
