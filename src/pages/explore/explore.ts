import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MapPage} from "../map/map";

@IonicPage()
@Component({
    selector: 'page-explore',
    templateUrl: 'explore.html',
})

export class ExplorePage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ExplorePage');
    }

    mapTo(value){
        this.navCtrl.push(MapPage, {
            locationIndex: value.toString()
        });
    }
}