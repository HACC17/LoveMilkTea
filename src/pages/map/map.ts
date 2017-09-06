import {Component, ViewChild, ElementRef} from '@angular/core';
import {FIREBASE_CONFIG} from "./../../app.firebase.config";
import * as firebase from 'firebase';
import {NavController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

declare var google;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})

export class MapPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;
    styledMapType: any;
    panorama: any;
    App: any;
    db: any;
    ref: any;
    marker: any;
    markers: any[]; // gonna hold all marker data in here for now.
    infoWindow: any;


    constructor(public navCtrl: NavController) {
        if (!firebase.apps.length) {
            this.App = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            console.log(firebase);
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");


    }

    ionViewDidLoad() {
        this.loadMap();
        this.loadTags();
    }

    loadMap() {
        this.styledMapType = new google.maps.StyledMapType(
            [
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
            ],
            {name: 'Styled Map'});

        this.map = new google.maps.Map(this.mapElement.nativeElement, {

            zoom: 16,
            center: { lat: 21.2969, lng: -157.8171 },
            //streetControlView: false;
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            }
        });

        this.panorama = this.map.getStreetView();
        this.panorama.setPosition({lat: 21.298393, lng: -157.818918});

        this.map.mapTypes.set('styled_map', this.styledMapType);
        this.map.setMapTypeId('styled_map');


        this.marker = new google.maps.Marker({
            position: { lat: 21.2969, lng: -157.8171 },
            title: 'University of Hawaii at Manoa',
            map: this.map,
        });

    }

    loadTags() {
        //load the tag data into the markers variable
        var markersTemp = [];
        this.ref.once('value').then(function (dataPoints) {

                dataPoints.forEach(function (dataPoint) {
                    markersTemp.push({
                        address: dataPoint.val().address,
                        description: dataPoint.val().description,
                        lat: dataPoint.val().lat,
                        lng: dataPoint.val().lng,
                        name: dataPoint.val().name,
                        number: dataPoint.val().number,
                        website: dataPoint.val().website
                    });
                });
            });

            //console.log(markersTemp);
            this.markers = markersTemp;
            console.log(markersTemp);

            for (var i = 0, length = this.markers.length; i < length; i++) {
                var data = this.markers[i],
                    latLng = new google.maps.LatLng(data.lat, data.lng);

                // Creating a marker and putting it on the map
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                });
            }
    }

    addMarker(locationIndex){
        console.log(locationIndex);
        if(this.marker) {
            this.clearMarker();
        }
        let geoData = [{
            "1": {
                "name": "Ka Leo Office",
                "address": "2445 Campus Road, Honolulu, HI, 96822",
                "lat": 21.2985860,
                "lng": -157.8195610,
                "description": "Ka Leo O Hawai'i has been the student newspaper for the Manoa campus since 1922. Papers publish biweekly during the school year and monthly in the summer, but do not run on holidays, breaks or exam periods.",
                "number": "(808) 956-7043",
                "website": "N/A"
            },
            "2": {
                "name": "Holmes Hall",
                "address": "2540 Dole Street, Honolulu, HI, 96822",
                "lat": 21.2968470,
                "lng": -157.8161010,
                "description": "Holmes Hall is home to the Mechanical Engineering, Civil Engineering, Computer Engineering, Electrical Engineering, Renewable Energy and Island Sustainability programs.",
                "number": "N/A",
                "website": "N/A"
            }
        }];
        let imgSrc = "http://manoanow.org/app/map/images/" + locationIndex + ".png";
        let infoContent = '<div class="ui grid"><img class="ui fluid image info" src="' + imgSrc + '">' + '<div id="windowHead">' + geoData[0][locationIndex].name + '</div>' + '<div id="description">' + geoData[0][locationIndex].description + '</div>' + '<div id="addressTitle">Address: ' + geoData[0][locationIndex].address + '</div>' + '<div id="phoneTitle">Phone: ' + geoData[0][locationIndex].number + '</div>' + '</div>';

        this.marker = new google.maps.Marker({
            position: { lat: geoData[0][locationIndex].lat, lng: geoData[0][locationIndex].lng},
            title: 'University of Hawaii at Manoa',
            map: this.map,
        });
        
        this.infoWindow = new google.maps.InfoWindow({
            content: infoContent,
        });

        this.infoWindow.open(this.map, this.marker);
    }

    clearMarker() {
        this.marker.setMap(null);
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

