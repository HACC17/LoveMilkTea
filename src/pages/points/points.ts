import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import * as firebase from 'firebase';
import * as _ from 'underscore/underscore';


@IonicPage()
@Component({
    selector: 'points-page',
    templateUrl: 'points.html'
})

export class PointsPage {
    @ViewChild('commentText') commentText;
    ref: any;
    App: any;
    db: any;
    name: any;
    address: any;
    number: any;
    description: any;
    key: any;
    public comments: any[];
    image: any;
    date: any;
    showAdd: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, private toast: ToastController) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("/testPoints/");
        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.key = String(this.navParams.get('key'));
        if (this.navParams.get('key') > 163) {
            this.image =  "../../assets/images/uhLogo.jpg";
        } else {
            if (!isNaN(this.navParams.get('key'))) {
                this.image = "http://manoanow.org/app/map/images/" + this.key + ".png";
            } else {
                this.image = "../../assets/images/uhLogo.jpg";
            }
        }
        this.date = new Date();
        this.showAdd = false;
    }

    ionViewDidLoad() {
      this.showComments();
    }

    showComments() {
        var item = [];
        this.ref.child(this.key).child("comments").once("value")
            .then((dataPoints) => {
                item = dataPoints.val();
                this.comments = _.toArray(item);
        });

    }

    addComments(formData: NgForm){
        this.date = new Date().toString();
        Object.assign(formData.value, {'dateTime': this.date});

        let comments = this.ref.child(this.key);
        comments.child('/comments').push(formData.value);
        this.showComments();
        this.toggleAddButton();
        this.commentText.value = "";
    }
    toggleAddButton() {
        this.showAdd = !this.showAdd;
    }
    getDate(comment: any) {
        return new Date(comment.dateTime).getMonth() + 1 + '/' + new Date(comment.dateTime).getDate() + '/' + new Date(comment.dateTime).getFullYear()
    }

}
