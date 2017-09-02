import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google;

@Component ({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    panorama: any;

    constructor(public navCtrl: NavController) {

    }

    ionViewDidLoad(){
        this.loadMap();
    }

    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 18,
            center: {lat: 21.298393, lng: -157.818918},
            //streetViewControl: false
        });

        this.panorama = this.map.getStreetView();
        this.panorama.setPosition({lat: 21.298393, lng: -157.818918});

        var marker = new google.maps.Marker({
            position: {lat: 21.298393, lng: -157.818918},
            map: this.map,
        });
    }

    //Could be useful if needed.
    toggleStreetView() {
        let toggle = this.panorama.getVisible();
        if (toggle == false) {
            this.panorama.setVisible(true);
        } else {
            this.panorama.setVisible(false);
        }
    }


}

