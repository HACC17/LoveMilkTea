import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {LoadingController} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import * as _ from 'underscore/underscore'

@IonicPage()
@Component({
    selector: 'points-page',
    templateUrl: 'points.html'
})

export class PointsPage {
    ref: any;
    App: any;
    db: any;
    name: any;
    address: any;
    number: any;
    description: any;
    allComments: any;
    showing: any;
    key: any;
    comments: any;
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
        this.ref = this.db.ref("testPoints");

        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.allComments = this.navParams.get('comments');
        this.showing = false;
        this.key = this.navParams.get('key');
        this.image = "http://manoanow.org/app/map/images/" + this.key + ".png";
        this.date = new Date();
        console.log(this.date);
        this.showAdd = false;
    }

    ionViewDidLoad() {
    }

    showComments(){
        if(this.showing){
            this.showing = false;
        } else {
            this.showing = true;
            this.comments = _.values(this.allComments);
            this.comments = _.toArray(this.comments);
            console.log(this.comments);
            //this.comments = _.pluck(comments, 'messages');
        }
    }

    addComments(formData: NgForm){
        this.date = new Date().toString();
        Object.assign(formData.value, {'dateTime': this.date});

        let comments =  this.ref.child(this.key);
        comments.child('/comments').push(formData.value);
        console.log(formData.value);
    }
    showAddButton(){
        if(this.showAdd) {
            this.showAdd = false;
        }else{
            this.showAdd = true;
        }
    }

}
