import {Component, ViewChild, ElementRef, Injectable} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {LoadingController} from 'ionic-angular';
import {SubmitDataPage} from "../submit-data/submit-data";

import { AlertController } from 'ionic-angular';

declare var google;


@Component({
    selector: 'submit-data-coords-page',
    templateUrl: 'submit-data-choose-cords.html'
})

export class SubmitDataChooseCoordsPage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    App: any;
    db: any;
    ref: any;
    lat: any;
    long: any;
    url: any;
    address: any;


    constructor(public navCtrl: NavController, private alertCtrl: AlertController, public loading: LoadingController,  public http: Http) {

        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            console.log(firebase);
            this.App = firebase.app();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");

    }
    ionViewDidLoad() {
        this.loadMap();
    }


    getCoords(){
        let alert = this.alertCtrl.create({
            title: 'Subitt This Point',
            subTitle: 'Would you to use the following information to submit your point?',
            message: `Latitude: ${this.lat}  \n Longitude: ${this.long} \n\n Address: ${this.address}`,
            buttons: [
                {
                    text: 'ok',
                    role: 'approve',
                    handler: () => {
                        this.navCtrl.push(SubmitDataPage);
                    }
                }],

        });
        alert.present();
        console.log(this.lat);
    }
    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;

        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
    }

    loadMap() {

        this.map = new google.maps.Map(this.mapElement.nativeElement, {

            zoom: 18,
            center: {lat: 21.2969, lng: -157.8171},
            //streetControlView: false;
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            },
            styles: [
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "20"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "10"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "25"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ffbb00"
                        },
                        {
                            "saturation": 43.400000000000006
                        },
                        {
                            "lightness": 37.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00FF6A"
                        },
                        {
                            "saturation": -1.0989010989011234
                        },
                        {
                            "lightness": 11.200000000000017
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FFC200"
                        },
                        {
                            "saturation": -61.8
                        },
                        {
                            "lightness": 45.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#24a95a"
                        },
                        {
                            "lightness": "29"
                        },
                        {
                            "saturation": "-58"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 51.19999999999999
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 52
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "hue": "#00b1ff"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00ffda"
                        },
                        {
                            "saturation": "-50"
                        },
                        {
                            "lightness": "25"
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                }
            ]
        });

        google.maps.event.addListener(this.map, 'click', (event) => {
            this.lat = event.latLng.lat();
            this.long = event.latLng.lng();
            this.getAddress();
            this.getCoords();
        });

    }

}
