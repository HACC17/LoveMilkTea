webpackJsonp([5],{

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_firebase_config__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_util__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_util__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_fuse_js__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_fuse_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_fuse_js__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








// Array to contain Markers on the map
let stash = [];
let MapPage = class MapPage {
    constructor(navCtrl, navParams, loading, http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.http = http;
        this.typeList = ["Classroom", "Drink", "Food", "Entertainment", "Housing", "Library", "Parking", "Recreational", "Service"];
        // Should we load location types from a config file?
        this.changeIcon = false;
        this.isSearching = false;
        // set up search params for the fuzzy search
        this.fuseOptions = {
            caseSensitive: false,
            keys: ['address', 'description', 'name', 'type'],
            threshold: 0.5,
            shouldSort: true,
        };
        // holds icon SVG data and styling.
        this.icons = {
            food: {
                //spoon and fork
                path: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            drink: {
                //drink glass
                path: 'M6 4l4.03 36.47C10.26 42.46 11.95 44 14 44h20c2.05 0 3.74-1.54 3.97-3.53L42 4H6zm18 34c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-10.8S30 28 30 32c0 3.31-2.69 6-6 6zm12.65-22h-25.3l-.88-8h27.07l-.89 8z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            classroom: {
                //school
                path: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            entertainment: {
                //mood
                path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            housing: {
                //home
                path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            library: {
                //book
                path: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            parking: {
                //local parking
                path: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            recreational: {
                //local event
                path: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
            service: {
                //business center
                path: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
            },
        };
        this.exploreIndex = navParams.get('locationIndex');
        this.exploreIndex2 = navParams.get('locationIndex2');
        this.currentLat = navParams.get('currentLat');
        this.currentLng = navParams.get('currentLng');
        if (!__WEBPACK_IMPORTED_MODULE_2_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_2_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_1__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            console.log(__WEBPACK_IMPORTED_MODULE_2_firebase__);
            this.App = __WEBPACK_IMPORTED_MODULE_2_firebase__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");
    }
    ionViewDidLoad() {
        this.loadTags();
        this.loadMap();
    }
    searchPoints(input) {
        this.isSearching = true;
        let fuse = new __WEBPACK_IMPORTED_MODULE_7_fuse_js__(this.locationsList, this.fuseOptions);
        console.log(input);
        if (input === '') {
            this.locationsList = this.geoMarkers;
        }
        else {
            //console.log(fuse.search(input));
            this.locationsList = fuse.search(input);
        }
    }
    stopSearch() {
        this.isSearching = false;
    }
    showSearch() {
        this.isSearching = true;
    }
    //retrieves the tags from our firebase, populates them on map.
    loadTags() {
        this.clearAllMarkers();
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")
            .then((dataPoints) => {
            //console.log(dataPoints.val())
            dataPoints.forEach((dataPoint) => {
                this.geoMarkers.push({
                    key: dataPoint.key,
                    address: dataPoint.val().address,
                    description: dataPoint.val().description,
                    lat: dataPoint.val().lat,
                    lng: dataPoint.val().lng,
                    name: dataPoint.val().name,
                    number: dataPoint.val().number,
                    website: dataPoint.val().website,
                    type: dataPoint.val().type
                });
            });
            console.log(this.geoMarkers);
        })
            .then(() => {
            if (this.exploreIndex && this.currentLat && this.currentLng) {
                this.createExpRoute();
            }
            else if (!this.exploreIndex && this.exploreIndex2) {
                this.addMarker(this.exploreIndex2);
            }
            // for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
            //     this.locationsList.push({value: i, text: this.geoMarkers[i].name});
            // }
            this.locationsList = this.geoMarkers;
            console.log(this.locationsList);
            this.infoWindow = new google.maps.InfoWindow();
            for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                let data = this.geoMarkers[i], latLng = new google.maps.LatLng(data.lat, data.lng);
                // type = this.geoMarkers[i].type;
                // Creating a marker and putting it on the map
                let marker = new google.maps.Marker({
                    position: latLng,
                    //map: this.map,
                    icon: this.icons[data.type],
                });
                // marker.setIcon(this.icons[data.type]);
                stash.push(marker);
                let info = "Address: " + data.address + " Name: " + data.name;
                google.maps.event.addListener(marker, 'click', (() => {
                    this.infoWindow.setContent(info);
                    this.infoWindow.open(this.map, marker);
                }));
            }
        });
    }
    //pass in the entire object now that key field holds image index
    addMarker(location) {
        if (this.marker) {
            this.clearStarterMarker();
        }
        this.stopSearch();
        console.log(location);
        //const geoData = this.geoMarkers;
        const imgIndex = location.key;
        let imgSrc = "http://manoanow.org/app/map/images/" + imgIndex + ".png";
        let infoContent = '<div class="ui grid"><img class="ui fluid image info" src="' + imgSrc + '">'
            + '<div id="windowHead">' + location.name + '</div>'
            + '<div id="description">' + location.description + '</div>'
            + '<div id="addressTitle">Address: ' + location.address + '</div>'
            + '<div id="phoneTitle">Phone: ' + location.number + '</div>' + '</div>';
        this.marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[location.type],
        });
        this.infoWindow = new google.maps.InfoWindow({
            content: infoContent,
        });
        this.infoWindow.open(this.map, this.marker);
    }
    clearStarterMarker() {
        this.marker.setMap(null);
    }
    setStartValue(locationIndex) {
        this.startValue = locationIndex;
        this.createRoute();
    }
    setDestValue(locationIndex) {
        this.endValue = locationIndex;
        this.createRoute();
    }
    createRoute() {
        this.clearRoute();
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        if ((!Object(__WEBPACK_IMPORTED_MODULE_6_util__["isNullOrUndefined"])(this.startValue)) && (!Object(__WEBPACK_IMPORTED_MODULE_6_util__["isNullOrUndefined"])(this.endValue))) {
            this.directionsDisplay.setMap(this.map);
            this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay, this.startValue, this.endValue);
            if (this.changeIcon === true) {
                this.changeAllMarkers();
            }
        }
    }
    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay, sValue, eValue) {
        const geoData = this.geoMarkers;
        let origin = { lat: geoData[sValue].lat, lng: geoData[sValue].lng };
        let destination = { lat: geoData[eValue].lat, lng: geoData[eValue].lng };
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    // For explore page routing
    createExpRoute() {
        if (this.marker) {
            this.clearStarterMarker();
        }
        this.clearRoute();
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
        this.calculateAndDisplayExpRoute(this.directionsService, this.directionsDisplay);
    }
    // For explore page routing
    calculateAndDisplayExpRoute(directionsService, directionsDisplay) {
        const geoData = this.geoMarkers;
        let origin = { lat: this.currentLat, lng: this.currentLng };
        let destination = { lat: geoData[this.exploreIndex].lat, lng: geoData[this.exploreIndex].lng };
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    //Could be useful if needed.
    toggleStreetView() {
        let toggle = this.panorama.getVisible();
        if (toggle == false) {
            this.panorama.setVisible(true);
        }
        else {
            this.panorama.setVisible(false);
        }
    }
    //Gets data from locations.json file if needed
    getGeoData() {
        this.http.get('assets/data/locations.json')
            .map((res) => res.json())
            .subscribe(data => {
            this.jsonData = data;
        }, (rej) => {
            console.error("Could not load local data", rej);
        });
    }
    filterMarker(category) {
        let criteria = category.charAt(0).toLowerCase() + category.slice(1);
        console.log(criteria);
        // For "dual-layered" filtering clean out the "changeAllMarkers call"
        this.changeAllMarkers();
        //load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")
            .then((dataPoints) => {
            dataPoints.forEach((dataPoint) => {
                this.geoMarkers.push({
                    address: dataPoint.val().address,
                    description: dataPoint.val().description,
                    lat: dataPoint.val().lat,
                    lng: dataPoint.val().lng,
                    name: dataPoint.val().name,
                    number: dataPoint.val().number,
                    website: dataPoint.val().website,
                    type: dataPoint.val().type
                });
            });
        })
            .then(() => {
            for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
                this.locationsList.push({ value: i, text: this.geoMarkers[i].name });
            }
            console.log(this.locationsList);
            this.infoWindow = new google.maps.InfoWindow();
            for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
                let data = this.geoMarkers[i], latLng = new google.maps.LatLng(data.lat, data.lng);
                if (data.type === criteria) {
                    // Creating a marker and putting it on the map
                    let marker = new google.maps.Marker({
                        position: latLng,
                        map: this.map,
                        icon: this.icons[data.type],
                    });
                    // Push into a Markers array
                    stash.push(marker);
                    let info = "Address: " + data.address + " Name: " + data.name;
                    google.maps.event.addListener(marker, 'click', (() => {
                        this.infoWindow.setContent(info);
                        this.infoWindow.open(this.map, marker);
                    }));
                }
                else {
                    console.log("Category: " + criteria + " does not exist!");
                }
            }
        });
    }
    changeAllMarkers() {
        if (this.changeIcon === true) {
            if (stash) {
                for (let i = 0; i < stash.length; i++) {
                    stash[i].setMap(null);
                }
                stash.length = 0;
                this.changeIcon = false;
            }
            else {
                console.log('Stash array does not exist!');
            }
        }
        else if (this.changeIcon === false) {
            this.changeIcon = true;
            this.placeAllMarkers();
        }
    }
    clearAllMarkers() {
        if (stash) {
            for (let i = 0; i < stash.length; i++) {
                stash[i].setMap(null);
            }
            stash.length = 0;
            this.changeIcon = false;
        }
        else {
            console.log('Stash array does not exist!');
        }
    }
    placeAllMarkers() {
        //const geoData = this.geoMarkers; //this creates an array of nearly 43 million.... So i got rid of it.
        if (this.exploreIndex && this.currentLat && this.currentLng) {
            this.createExpRoute();
        }
        // for (let i = 0; i <= geoData.length - 1; i++) {
        //     this.locationsList.push({value: i, text: geoData[i].name});
        // }
        this.infoWindow = new google.maps.InfoWindow();
        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i], latLng = new google.maps.LatLng(data.lat, data.lng);
            // type = this.geoMarkers[i].type;
            // Creating a marker and putting it on the map
            let marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                icon: this.icons[data.type],
            });
            // marker.setIcon(this.icons[data.type]);
            stash.push(marker);
            let info = "Address: " + data.address + " Name: " + data.name;
            google.maps.event.addListener(marker, 'click', (() => {
                this.infoWindow.setContent(info);
                this.infoWindow.open(this.map, marker);
            }));
            this.changeIcon = true;
        }
    }
    //Use HTML5 geolocation to get current lat/lng and place marker there
    showCurrLocation() {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        });
        if (navigator.geolocation) {
            this.loader.present().then(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLat = position.coords.latitude;
                    this.currentLng = position.coords.longitude;
                    var latLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.userMarker.setPosition(latLng);
                    this.userMarker.setMap(this.map);
                    this.map.setCenter(latLng);
                    this.loader.dismiss();
                });
            });
        }
    }
    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 15,
            zoomControl: false,
            center: { lat: 21.2969, lng: -157.8171 },
            //streetControlView: false;
            mapTypeControlOptions: {
                mapTypeIds: ['styled_map']
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
        this.panorama = this.map.getStreetView();
        this.panorama.setPosition({ lat: 21.298393, lng: -157.818918 });
        //set up a default marker.
        this.userMarker = new google.maps.Marker({
            position: { lat: 21.2969, lng: -157.8171 },
            title: 'University of Hawaii at Manoa',
            //map: this.map,
            icon: {
                //directions walk
                path: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
                fillColor: 'lightgreen',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
                scale: 1.75
            }
        });
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('map'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
], MapPage.prototype, "mapElement", void 0);
MapPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-map',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/map/map.html"*/'<ion-header>\n</ion-header>\n\n<ion-content>\n  <div>\n    <div id="float-button-left-top">\n      <button ion-button clear menuToggle><ion-icon id="menu-icon" large name="menu"></ion-icon></button>\n    </div>\n    <div style="margin-left: 40px" id="search">\n\n      <!-- <div *ngIf="!isSearching">\n        <button ion-button (click)="showSearch()">\n          <ion-icon name="search"></ion-icon>\n        </button>\n      </div> -->\n\n      <ion-grid>\n        <ion-row>\n          <ion-col>\n            <ion-searchbar showCancelButton	[(ngModel)]="input" (ionInput)="searchPoints(input)" (ionCancel)="stopSearch($event)"\n                           placeholder="Search"></ion-searchbar>\n          </ion-col>\n        </ion-row>\n      </ion-grid>\n\n      <ion-scroll class="scrollable" scrollY="true">\n        <ion-list>\n          <ion-item *ngFor="let location of locationsList">\n            <ion-grid>\n              <ion-row>\n                <ion-col>\n                  {{location.name}}\n                </ion-col>\n                <ion-col>\n                  <button ion-button (click)="addMarker(location)">\n                    <ion-icon name="close-circle"></ion-icon>\n                  </button>\n                </ion-col>\n              </ion-row>\n            </ion-grid>\n          </ion-item>\n        </ion-list>\n      </ion-scroll>\n    </div>\n  </div>\n\n  <div id="float-button-left-bottom">\n    <button ion-fab mini (click)="changeAllMarkers()">\n      <ion-icon [name]="changeIcon ? \'remove\' :\'add\'"></ion-icon>\n    </button>\n    <button ion-fab mini (click)="toggleStreetView()">\n      <ion-icon name="eye"></ion-icon>\n    </button>\n    <button ion-fab mini (click)="showCurrLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n  </div>\n\n  <div #map id="map"></div>\n\n  <ion-item>\n    <ion-label>Filter</ion-label>\n    <ion-select [(ngModel)]="filter" multiple="false" #C (ionChange)="filterMarker(C.value)" cancelText="Cancel"\n                okText="Filter!">\n      <ion-option *ngFor="let item of typeList" value="{{item}}">{{item}}</ion-option>\n    </ion-select>\n  </ion-item>\n\n  <ion-item>\n    <ion-label>Select A Location</ion-label>\n    <ion-select #newSelect [(ngModel)]="location" (ionChange)="addMarker(location)">\n      <ion-option *ngFor="let item of locationsList" value="{{item.value}}">{{item.text}}</ion-option>\n    </ion-select>\n  </ion-item>\n\n  <ion-item>\n    <ion-label>Select A Starting Location</ion-label>\n    <ion-select #newSelect [(ngModel)]="startLoc" (ionChange)="setStartValue(startLoc)">\n      <ion-option *ngFor="let item of locationsList" value="{{item.value}}">{{item.text}}</ion-option>\n    </ion-select>\n  </ion-item>\n\n  <ion-item>\n    <ion-label>Select A Destination</ion-label>\n    <ion-select #newSelect [(ngModel)]="endLoc" (ionChange)="setDestValue(endLoc)">\n      <ion-option *ngFor="let item of locationsList" value="{{item.value}}">{{item.text}}</ion-option>\n    </ion-select>\n  </ion-item>\n\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/map/map.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */]])
], MapPage);

//# sourceMappingURL=map.js.map

/***/ }),

/***/ 150:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_firebase_config__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(51);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let SubmitDataPage = class SubmitDataPage {
    constructor(navCtrl, navParams, loading, toast, http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        this.http = http;
        if (!__WEBPACK_IMPORTED_MODULE_3_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_2__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("dataPoints");
        this.token = this.navParams.get('token');
        if (!this.token) {
            this.latitude = this.navParams.get('lat');
            this.longitude = this.navParams.get('long');
            this.address = this.navParams.get('address');
        }
    }
    ionViewDidLoad() {
        if (this.token) {
            this.getCurrLocation();
        }
    }
    onSubmit(formData) {
        for (var element in formData.value) {
            if (formData.value[element] === undefined) {
                formData.value[element] = "n/a";
            }
        }
        Object.assign(formData.value, { 'status': 'pending' });
        this.childRef = this.ref.push();
        this.childRef.set(formData.value);
        this.toast.create({
            message: `Data submitted!`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot('HomePage');
    }
    // Uses HTML5 navigator to get lat/long
    getCurrLocation() {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        });
        if (navigator.geolocation) {
            this.loader.present().then(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.getAddress();
                    this.loader.dismiss();
                });
            });
        }
    }
    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
    }
};
SubmitDataPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-page',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data/submit-data.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n<ion-list inset>\n  <form #formData=\'ngForm\'(ngSubmit)="onSubmit(formData)">\n    <ion-label>Point of Interest</ion-label>\n    <ion-item>\n      <ion-label color="primary">Name</ion-label>\n      <ion-input type="text" placeholder="Enter name for point of interest" [(ngModel)]="pointName" name="pointName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Latitude</ion-label>\n      <ion-input type="text" placeholder="Enter latitude" [(ngModel)]="latitude" name="latitude"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Longitude</ion-label>\n      <ion-input type="text" placeholder="Enter longitude"[(ngModel)]="longitude" name="longitude"></ion-input>\n    </ion-item>\n    <ion-item>\n    <ion-label color="primary">Address</ion-label>\n    <ion-input type="text" placeholder="Enter address"[(ngModel)]="address" name="address"></ion-input>\n  </ion-item>\n    <ion-item>\n      <ion-label color="primary">Phone</ion-label>\n      <ion-input type="text" placeholder="Enter phone for point of interest"[(ngModel)]="phone" name="phone"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Website</ion-label>\n      <ion-input type="text" placeholder="Enter a website point of interest"[(ngModel)]="website" name="website"></ion-input>\n    </ion-item>\n\n      <ion-list>\n        <ion-label color="primary">Location Type</ion-label>\n        <ion-item>\n          <ion-select placeholder="Choose One"[(ngModel)]="type" name="type" cancelText="Nah" okText="Okay!">\n            <!-- <ion-option value="unknown" selected="true">Unknown</ion-option> -->\n            <ion-option value="classroom">\n              Classroom\n            </ion-option>\n            <ion-option value="service">Service</ion-option>\n            <ion-option value="restaurant">Restaurant</ion-option>\n            <ion-option value="bathroom">Bathroom</ion-option>\n            <ion-option value="vending machine">Vending Machine</ion-option>\n            <ion-option value="office">Office</ion-option>\n            <ion-option value="other">Other</ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-list>\n\n    <ion-label>Contact Information</ion-label>\n    <ion-item>\n      <ion-label color="primary">First Name</ion-label>\n      <ion-input type="text" placeholder="Enter name" [(ngModel)]="firstName" name="firstName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Last Name</ion-label>\n      <ion-input type="text" placeholder="Enter name" [(ngModel)]="lastName" name="lastName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Contact Email</ion-label>\n      <ion-input type="text" placeholder="Enter email" [(ngModel)]="email" name="email"></ion-input>\n    </ion-item>\n    <br/>\n\n    <ion-item>\n      <ion-label color="primary" stacked >Description</ion-label>\n      <ion-input type="text" placeholder="Enter point of interest description" [(ngModel)]="description" name="description"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary" stacked >Note to Admin</ion-label>\n      <ion-input type="text" placeholder="Enter a note to the Admin" [(ngModel)]="note" name="note"></ion-input>\n    </ion-item>\n    <button ion-button type="submit" block>Submit</button>\n  </form>\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data/submit-data.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */]])
], SubmitDataPage);

//# sourceMappingURL=submit-data.js.map

/***/ }),

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(152);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let LoginPage = class LoginPage {
    constructor(afAuth, toast, navCtrl, navParams) {
        this.afAuth = afAuth;
        this.toast = toast;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.user = {};
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
                if (result) {
                    this.navCtrl.setRoot('AdminPage');
                    this.toast.create({
                        message: `Admin Access Granted`,
                        duration: 3000
                    }).present();
                    console.log(this.afAuth.auth.currentUser);
                }
            }
            catch (e) {
                this.toast.create({
                    message: e,
                    duration: 3000
                }).present();
            }
        });
    }
};
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-login',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/login/login.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Login</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <ion-item>\n    <ion-label floating>Email Address</ion-label>\n    <ion-input type="text" [(ngModel)]="user.email"></ion-input>\n  </ion-item>\n\n  <ion-item>\n    <ion-label floating>Password</ion-label>\n    <ion-input type="password" [(ngModel)]="user.password"></ion-input>\n  </ion-item>\n\n\n  <button ion-button class="login-btn" full color="primary" (click)="login(user)">Login</button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/login/login.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_map__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let ExplorePage = class ExplorePage {
    constructor(navCtrl, navParams, http) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dist = [];
        this.dur = [];
        this.expLocations = "21.2989380,-157.8185730" +
            "|21.2984350,-157.8188780" +
            "|21.3004500,-157.8161520" +
            "|21.2943550,-157.8186020" +
            "|21.2993160,-157.8150410" +
            "|21.3008300,-157.8156720" +
            "|21.3001970,-157.8183760" +
            "|21.2984860,-157.8201670" +
            "|21.2983360,-157.8152250" // University Health Services
        ;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;
                this.currentLocation = this.currentLat + "," + this.currentLng;
                this.findDistanceAndDuration();
            });
        }
        else {
            console.log("Location blocked");
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ExplorePage');
    }
    mapTo(value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */], {
            locationIndex: value.toString(),
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }
    showLocation(value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */], {
            locationIndex2: value.toString()
        });
    }
    // will check if app has access to user current location to calculate distance from point of interest
    hasCurrLocation() {
        if (this.currentLocation) {
            return true;
        }
        else {
            return false;
        }
    }
    //must add 'Allow-Control-Allow-Origin: *' Chrome plugin to local browser
    findDistanceAndDuration() {
        this.url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.currentLocation}&destinations=${this.expLocations}&mode=walking&units=imperial&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.loadDistanceAndDuration(data);
        });
    }
    loadDistanceAndDuration(data) {
        var length = data.rows[0].elements.length;
        for (var i = 0; i < length; i++) {
            this.dist.push("(" + data.rows[0].elements[i].distance.text + ")");
            this.dur.push(data.rows[0].elements[i].duration.text);
        }
    }
};
ExplorePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-explore',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/explore/explore.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Explore</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(147)">\n      <div id="wrc">\n        <div class="card-title">Warrior Rec Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="basketball"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Warrior Rec Center is approximately 66,000 sq ft and is considered to be one of the\n        best recreational facilities in the state.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[0]}}</span>\n        <span item-left>{{dist[0]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(147)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(2)">\n      <div id="cc">\n        <div class="card-title">Campus Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="pizza"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The campus center offers the university community and the public a wide variety of meeting,\n        dining and entertainment options to enrich campus life and the educational experience.\n        It is the primary venue for programs and events to create an environment where individuals can come and relax,\n        study and be entertained or challenged.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[1]}}</span>\n        <span item-left>{{dist[1]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(2)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(3)">\n      <div id="hamilton">\n        <div class="card-title">Hamilton Library</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="book"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Hamilton Library at the University of Hawaiʻi at Mānoa is the largest research library\n        in the state of Hawaii. The Library serves as a key resource for the flagship Manoa campus as well as the other\n        University of Hawaii system campuses.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[2]}}</span>\n        <span item-left>{{dist[2]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(3)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(130)">\n      <div id="stan-sheriff">\n        <div class="card-title">Stan Sheriff</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="beer"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Stan Sheriff Center opened in 1994 and is the jewel of the Athletics Department. The\n        center has served as the home of the University of Hawai‘i men’s and women’s basketball and volleyball teams and\n        has played host to a number of memorable events.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[3]}}</span>\n        <span item-left>{{dist[3]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(130)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(15)">\n      <div id="kennedy-theatre">\n        <div class="card-title">Kennedy Theatre</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="people"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Kennedy Theatre at the University of Hawai‘i at Manoa is the home base for the\n        productions of the Department of Theatre + Dance.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[4]}}</span>\n        <span item-left>{{dist[4]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(15)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(20)">\n      <div id="paradise-palms">\n        <div class="card-title">Paradise Palms Café</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="pizza"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Paradise Palms Café features six food vendors, an air-conditioned dining room, and an\n        outdoor eating area.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[5]}}</span>\n        <span item-left>{{dist[5]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(20)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(151)">\n      <div id="qlc">\n        <div class="card-title-2">Queen Lili\'uokalani Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="person"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Queen Lili\'uokalani Center, often called QLC, is a center for various student services, including the Office of Admissions, Office of the Registrar, Commuter Services, Financial Aid Services, Mānoa Advising Center, and much more.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[6]}}</span>\n        <span item-left>{{dist[6]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(151)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(4)">\n      <div id="sinclair">\n        <div class="card-title">Sinclair Library</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="book"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">Sinclair Library, a popular place for late-night studying, is the only library open 24 hours on weekdays.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[7]}}</span>\n        <span item-left>{{dist[7]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(4)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(7)">\n      <div id="uhs">\n        <div class="card-title-2">University Health Services</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="medkit"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The University Health Services Mānoa offers a wide range of medical services and programs. These include general medical care by appointment or on a walk-in basis; women\'s health, sports medicine, psychiatry, dermatology, and nutrition clinics by appointment</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[8]}}</span>\n        <span item-left>{{dist[8]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(7)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n</ion-content>'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/explore/explore.html"*/,
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */]])
], ExplorePage);

//# sourceMappingURL=explore.js.map

/***/ }),

/***/ 161:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 161;

/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/admin/admin.module": [
		443,
		1
	],
	"../pages/edit-submit-data/edit-submit-data.module": [
		444,
		0
	],
	"../pages/explore/explore.module": [
		442,
		4
	],
	"../pages/home/home.module": [
		440,
		3
	],
	"../pages/login/login.module": [
		441,
		2
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 203;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataLandingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__submit_data_submit_data__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__submit_data_choose_coords_submit_data_choose_coords__ = __webpack_require__(289);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let SubmitDataLandingPage = class SubmitDataLandingPage {
    constructor(navCtrl, loading, toast, http) {
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.http = http;
    }
    ionViewDidLoad() {
    }
    goMainPage() {
        this.token = ({ 'token': true });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__submit_data_submit_data__["a" /* SubmitDataPage */], this.token);
    }
    goMap() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */]);
    }
};
SubmitDataLandingPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-data-landing-page',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data-landing/submit-data-landing.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <button ion-button large (click)="goMainPage()">Submit your current location</button>\n  <button ion-button large (click)="goMap()">Browse a map to find a location</button>\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data-landing/submit-data-landing.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
], SubmitDataLandingPage);

//# sourceMappingURL=submit-data-landing.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataChooseCoordsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_firebase_config__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__submit_data_submit_data__ = __webpack_require__(150);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let SubmitDataChooseCoordsPage = class SubmitDataChooseCoordsPage {
    constructor(navCtrl, alertCtrl, loading, http) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loading = loading;
        this.http = http;
        if (!__WEBPACK_IMPORTED_MODULE_5_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_5_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_4__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            console.log(__WEBPACK_IMPORTED_MODULE_5_firebase__);
            this.App = __WEBPACK_IMPORTED_MODULE_5_firebase__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");
    }
    ionViewDidLoad() {
        this.loadMap();
    }
    getCoords() {
        let alert = this.alertCtrl.create({
            title: 'Subitt This Point',
            subTitle: 'Would you to use the following information to submit your point?',
            message: `Latitude: ${this.lat}  \n Longitude: ${this.long} \n\n Address: ${this.address}`,
            buttons: [
                {
                    text: 'ok',
                    role: 'approve',
                    handler: () => {
                        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__submit_data_submit_data__["a" /* SubmitDataPage */], { 'token': false, 'lat': this.lat, 'long': this.long, 'address': this.address });
                    }
                }
            ],
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
            center: { lat: 21.2969, lng: -157.8171 },
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
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('map'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
], SubmitDataChooseCoordsPage.prototype, "mapElement", void 0);
SubmitDataChooseCoordsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-data-coords-page',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data-choose-coords/submit-data-choose-cords.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <h1>Click to find Coordinates</h1>\n  <div #map id="map"></div>\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/submit-data-choose-coords/submit-data-choose-cords.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
], SubmitDataChooseCoordsPage);

//# sourceMappingURL=submit-data-choose-coords.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let HomePage = class HomePage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
};
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h3>Ionic Menu Starter</h3>\n\n  <p>\n    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will show you the way.\n  </p>\n\n  <button ion-button secondary menuToggle>Toggle Menu</button>\n</ion-content>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/pages/home/home.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(310);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_map_map__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_angularfire2_auth__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_firebase_config__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__angular_forms__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__ = __webpack_require__(288);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

















let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__["a" /* ExplorePage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__["a" /* SubmitDataPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                links: [
                    { loadChildren: '../pages/home/home.module#HomePageModule', name: 'HomePage', segment: 'home', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/explore/explore.module#ExplorePageModule', name: 'ExplorePage', segment: 'explore', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/admin/admin.module#AdminPageModule', name: 'AdminPage', segment: 'admin', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/edit-submit-data/edit-submit-data.module#AdminPageModule', name: 'EditSubmitDataPage', segment: 'edit-submit-data', priority: 'low', defaultHistory: [] }
                ]
            }),
            __WEBPACK_IMPORTED_MODULE_12_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_14__app_firebase_config__["a" /* FIREBASE_CONFIG */]),
            __WEBPACK_IMPORTED_MODULE_13_angularfire2_auth__["b" /* AngularFireAuthModule */],
            __WEBPACK_IMPORTED_MODULE_15__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_15__angular_forms__["d" /* ReactiveFormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__["a" /* ExplorePage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__["a" /* SubmitDataPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 431:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_map_map__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_explore_explore__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_landing_submit_data_landing__ = __webpack_require__(288);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let MyApp = class MyApp {
    constructor(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = 'HomePage';
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            {
                title: 'Home',
                icon: 'home',
                component: __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]
            },
            {
                title: 'User',
                icon: 'person',
                component: __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */]
            },
            {
                title: 'Map',
                icon: 'map',
                component: __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */]
            },
            {
                title: 'Explore',
                icon: 'search',
                component: __WEBPACK_IMPORTED_MODULE_7__pages_explore_explore__["a" /* ExplorePage */]
            },
            {
                title: 'Submit Point of Interest',
                icon: 'send',
                component: __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */]
            }
        ];
    }
    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/app/app.html"*/'<ion-menu [content]="content">\n  <!-- <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header> -->\n\n  <ion-content>\n    <ion-list class="item">\n      <button text-center menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        \n        <ion-icon name="{{ p.icon }}"></ion-icon>\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Users/tylerchong/Desktop/workspace/code/LoveMilkTea/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBwEarQZ-Z5DBO7UyZoxSUxYsdOVWJAh_I",
    authDomain: "hacc2017-4c641.firebaseapp.com",
    databaseURL: "https://hacc2017-4c641.firebaseio.com",
    projectId: "hacc2017-4c641",
    storageBucket: "",
    messagingSenderId: "79619520095"
};
/* harmony export (immutable) */ __webpack_exports__["a"] = FIREBASE_CONFIG;

//# sourceMappingURL=app.firebase.config.js.map

/***/ })

},[291]);
//# sourceMappingURL=main.js.map