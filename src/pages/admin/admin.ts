import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FIREBASE_CONFIG } from "./../../app.firebase.config";
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-admin',
    templateUrl: 'admin.html',
})
export class AdminPage {
    userInputRef: any;
    masterDataRef: any;
    App: any;
    db: any;
    items: string[];

    constructor(private afAuth: AngularFireAuth, private toast: ToastController, public navCtrl: NavController, public navParams: NavParams) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            this.App = firebase;
        }
        this.db = this.App.database();
        this.userInputRef = this.db.ref('/dataPoints/');
        this.masterDataRef = this.db.ref('/testPoints');
    }

    ionViewDidLoad() {
        const item = [];
        this.userInputRef.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                Object.assign(temp, {
                    'key': data.key
                });
                item.push(temp);
            });
        });
        this.items = item;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    approve(value) { // 'value' is the key for the entry
        this.userInputRef.child(value.key).update({'status': 'approved'});
        this.masterDataRef = this.masterDataRef.push();
        this.masterDataRef.set({
            'name': value.pointName,
            'address': value.address,
            'lat': value.latitude,
            'lng': value.longitude,
            'description': value.description,
            'number': value.phone,
            'website': value.website,
            'type': value.type,
        });
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    deny(value) {
        this.userInputRef.child(value.key).update({'status': 'denied'});
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }

    editData(value) {
        this.navCtrl.push('EditSubmitDataPage', value);
    }

    deleteItem(value) { // 'value' is the key for the entry
        this.userInputRef.child(value.key).remove();
        this.navCtrl.setRoot(this.navCtrl.getActive().component); // refresh the page
    }
    filterItems(value){
        const item = [];
        this.userInputRef.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                if (value === 'showAll') {
                    item.push(temp);
                } else if (temp.status === value){
                    item.push(temp);
                }
            });
        });
        this.items = item;
    }

    async logout() {
        const result = await this.afAuth.auth.signOut();
        this.navCtrl.setRoot('HomePage');
    }

}
