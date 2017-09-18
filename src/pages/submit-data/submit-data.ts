import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import * as firebase from 'firebase';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';

@Component({
    selector: 'submit-page',
    templateUrl: 'submit-data.html'
})

export class SubmitDataPage {
    ref: any;
    childRef: any;
    App: any;
    db: any;
    latitude: any;
    longitude: any;
    loader: any;
    url: any;
    address: any;
    token: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController, public http: Http) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("dataPoints");
        this.token = this.navParams.get('token');
        if(!this.token) {
            this.latitude = this.navParams.get('lat');
            this.longitude = this.navParams.get('long');
            this.address = this.navParams.get('address');
        }
    }

    ionViewDidLoad() {
      if(this.token){
          this.getCurrLocation();
      }
    }
    onSubmit(formData: NgForm) {
        for (var element in formData.value) {
            if(formData.value[element] === undefined){
                formData.value[element] = "n/a";
            }
        }
        Object.assign(formData.value, {'status': 'pending'});
        this.childRef = this.ref.push();
        this.childRef.set(formData.value);
        this.toast.create({
            message: `Data submitted!`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot('HomePage');
    }

    // Uses HTML5 navigator to get lat/long
    getCurrLocation () {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        })

        if(navigator.geolocation) {
            this.loader.present().then( () => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.getAddress();
                    this.loader.dismiss();
                })
            })

        }
    }
    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
    }

}
