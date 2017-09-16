import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'points-page',
    templateUrl: 'points.html'
})

export class PointsPage {
    name: any;
    address: any;
    number: any;
    description: any;
    comments: any;
    showing: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController) {
        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.comments = this.navParams.get('comments');
        this.showing = false;
    }

    ionViewDidLoad() {
    }

    showComments(){
        this.showing = true;
        console.log(this.showing);
    }

    addComments(){
        
    }

}
