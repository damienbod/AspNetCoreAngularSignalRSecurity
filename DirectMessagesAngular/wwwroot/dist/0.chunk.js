webpackJsonp([0],{

/***/ 362:
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Dialog hi</h2>\n<mat-dialog-content>\nHi\n    <button mat-raised-button (click)=\"openDialog()\">Open Dialog</button>\r\n\n</mat-dialog-content>\n<mat-dialog-actions>\n    <button mat-raised-button mat-dialog-close tabindex=\"-1\">Close</button>\n</mat-dialog-actions>\n"

/***/ }),

/***/ 363:
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n\n    <h1>{{message}}</h1>\n\n    <button mat-raised-button (click)=\"openDialog()\">Open Dialog</button>\n\n</div>"

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/@angular/common/esm5/common.js
var common = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/@angular/core/esm5/core.js
var core = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/@angular/router/esm5/router.js + 16 modules
var router = __webpack_require__(183);

// EXTERNAL MODULE: ./node_modules/@angular/material/esm5/material.es5.js + 48 modules
var material_es5 = __webpack_require__(126);

// CONCATENATED MODULE: ./angularApp/app/test/components/module1-dialog-component/module1-dialog.component.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var module1_dialog_component_Module1DialogComponent = (function () {
    function Module1DialogComponent() {
    }
    Module1DialogComponent = __decorate([
        Object(core["n" /* Component */])({
            selector: 'app-module-1-dialog',
            template: "\n  <mat-dialog-content><p>Hello!</p></mat-dialog-content>\n<mat-dialog-actions>\n  <button mat-button mat-dialog-close>Close</button>\n</mat-dialog-actions>\n  "
        })
    ], Module1DialogComponent);
    return Module1DialogComponent;
}());


// CONCATENATED MODULE: ./angularApp/app/test/components/comp-dialog-component/comp-dialog.component.ts
var comp_dialog_component___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var comp_dialog_component_CompDialogComponent = (function () {
    function CompDialogComponent(dialogRef, dialog) {
        this.dialogRef = dialogRef;
        this.dialog = dialog;
    }
    CompDialogComponent.prototype.openDialog = function () {
        this.dialog.open(module1_dialog_component_Module1DialogComponent);
    };
    CompDialogComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    CompDialogComponent.prototype.ngOnInit = function () {
    };
    CompDialogComponent = comp_dialog_component___decorate([
        Object(core["n" /* Component */])({
            selector: 'app-comp-dialog',
            template: __webpack_require__(362)
        }),
        __metadata("design:paramtypes", [material_es5["j" /* MatDialogRef */],
            material_es5["h" /* MatDialog */]])
    ], CompDialogComponent);
    return CompDialogComponent;
}());


// CONCATENATED MODULE: ./angularApp/app/test/components/test-component/test.component.ts
var test_component___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var test_component___metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var test_component_TestComponent = (function () {
    function TestComponent(dialog) {
        this.dialog = dialog;
        this.message = 'Hello from Test constructor';
    }
    TestComponent.prototype.openDialog = function () {
        this.dialog.open(comp_dialog_component_CompDialogComponent);
    };
    TestComponent = test_component___decorate([
        Object(core["n" /* Component */])({
            selector: 'app-test-component',
            template: __webpack_require__(363)
        }),
        test_component___metadata("design:paramtypes", [material_es5["h" /* MatDialog */]])
    ], TestComponent);
    return TestComponent;
}());


// CONCATENATED MODULE: ./angularApp/app/test/test.routes.ts


var routes = [
    { path: '', component: test_component_TestComponent }
];
var TestRoutes = router["a" /* RouterModule */].forChild(routes);

// EXTERNAL MODULE: ./angularApp/app/custom-material-module.ts
var custom_material_module = __webpack_require__(184);

// CONCATENATED MODULE: ./angularApp/app/test/test.module.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestModule", function() { return test_module_TestModule; });
var test_module___decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var test_module_TestModule = (function () {
    function TestModule() {
    }
    TestModule = test_module___decorate([
        Object(core["K" /* NgModule */])({
            imports: [
                common["b" /* CommonModule */],
                custom_material_module["a" /* CustomMaterialModule */],
                TestRoutes
            ],
            declarations: [
                test_component_TestComponent,
                module1_dialog_component_Module1DialogComponent,
                comp_dialog_component_CompDialogComponent
            ],
            entryComponents: [
                module1_dialog_component_Module1DialogComponent,
                comp_dialog_component_CompDialogComponent
            ],
        })
    ], TestModule);
    return TestModule;
}());



/***/ })

});
//# sourceMappingURL=0.chunk.js.map