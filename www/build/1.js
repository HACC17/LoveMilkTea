webpackJsonp([1],{

/***/ 446:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminPageModule", function() { return AdminPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__edit_submit_data__ = __webpack_require__(449);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AdminPageModule = class AdminPageModule {
};
AdminPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__edit_submit_data__["a" /* EditSubmitDataPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__edit_submit_data__["a" /* EditSubmitDataPage */]),
        ],
    })
], AdminPageModule);

//# sourceMappingURL=edit-submit-data.module.js.map

/***/ }),

/***/ 449:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditSubmitDataPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_firebase_config__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let EditSubmitDataPage = class EditSubmitDataPage {
    constructor(navCtrl, navParams, loading, toast) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        if (!__WEBPACK_IMPORTED_MODULE_3_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_2__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("dataPoints");
        // Set the values to repopulate the form
        this.pointName = this.navParams.get('pointName');
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');
        this.address = this.navParams.get('address');
        this.description = this.navParams.get('description');
        this.phone = this.navParams.get('phone');
        this.type = this.navParams.get('type');
        this.email = this.navParams.get('email');
        this.website = this.navParams.get('website');
        this.dataKey = this.navParams.get('key');
    }
    ionViewDidLoad() { }
    onSubmit(formData) {
        for (var element in formData.value) {
            this.ref.child(this.dataKey).update({ [element]: formData.value[element] });
        }
        this.toast.create({
            message: `Edit Complete`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot('AdminPage');
    }
};
EditSubmitDataPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'edit-submit-page',template:/*ion-inline-start:"/Users/chrisnguyenhi/Documents/git/LoveMilkTea/src/pages/edit-submit-data/edit-submit-data.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Edit Data</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n<ion-list inset>\n  <form #formData=\'ngForm\'(ngSubmit)="onSubmit(formData)">\n    <br/>\n    <ion-label>Point of Interest</ion-label>\n    <ion-item>\n      <ion-label color="primary">Point of interest name</ion-label>\n      <ion-input type="text" placeholder="Enter name for point of interest" [(ngModel)]="pointName" name="pointName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Latitude</ion-label>\n      <ion-input type="text" placeholder="Enter latitude" [(ngModel)]="latitude" name="latitude"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Longitude</ion-label>\n      <ion-input type="text" placeholder="Enter longitude"[(ngModel)]="longitude" name="longitude"></ion-input>\n    </ion-item>\n    <ion-item>\n    <ion-label color="primary">Address</ion-label>\n    <ion-input type="text" placeholder="Enter address"[(ngModel)]="address" name="address"></ion-input>\n  </ion-item>\n    <ion-item>\n      <ion-label color="primary">Phone</ion-label>\n      <ion-input type="text" placeholder="Enter phone for point of interest"[(ngModel)]="phone" name="phone"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Website</ion-label>\n      <ion-input type="text" placeholder="Enter a website point of interest"[(ngModel)]="website" name="website"></ion-input>\n    </ion-item>\n\n      <ion-list>\n        <ion-label color="primary">Location Type</ion-label>\n        <ion-item>\n          <ion-select placeholder="Choose one"[(ngModel)]="type" name="type" cancelText="Nah" okText="Okay!">\n            <ion-option value="unknown" selected="true">Unknown</ion-option>\n            <ion-option value="classroom">Classroom</ion-option>\n            <ion-option value="service">Service</ion-option>\n            <ion-option value="restaurant">Restaurant</ion-option>\n            <ion-option value="bathroom">Bathroom</ion-option>\n            <ion-option value="vending machine">Vending Machine</ion-option>\n            <ion-option value="office">Office</ion-option>\n            <ion-option value="other">Other</ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-list>\n\n    <ion-item>\n      <br/>\n      <ion-label color="primary" stacked >Description</ion-label>\n      <ion-input type="text" placeholder="Enter point of interest description" [(ngModel)]="description" name="description"></ion-input>\n    </ion-item>\n    <button ion-button type="submit" block>Edit</button>\n  </form>\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/chrisnguyenhi/Documents/git/LoveMilkTea/src/pages/edit-submit-data/edit-submit-data.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */]])
], EditSubmitDataPage);

//# sourceMappingURL=edit-submit-data.js.map

/***/ })

});
//# sourceMappingURL=1.js.map