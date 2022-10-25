import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { IPartyCif } from '../party-cif.model';

@Component({
    selector: 'jhi-party-cif-financial-info',
    templateUrl: './party-cif-financial-info.component.html',
    styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifFinancialInfoComponent {
    private _partyCif: IPartyCif;

    @Input()
    get partyCif() {
        return this._partyCif;
    }

    set partyCif(param: IPartyCif) {
        this._partyCif = param;
    }
    constructor() { }

    saveData() {
        console;
    }
}
