import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICif, Cif } from './cif.model';

import { CifService } from './cif.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Person, IPerson } from '../person/person.model';
import { PostalAddress, IPostalAddress } from '../postal-address/postal-address.model';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-cif-update',
  templateUrl: './cif-update.component.html',
  styleUrls: ['./css/cif.css'],
})
export class CifUpdateComponent extends AbstractEntityUpdateComponent<ICif> {
  public postalModels: IPostalAddress = new PostalAddress();
  public personModels: IPerson = new Person();
  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected cifService: CifService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, cifService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'cifListModification';
  }

  protected initialState(): any {
    return { item: new Cif(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
    });
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get cif() {
    return this.item;
  }

  saveData() {
    console.log(this.personModels);
    console.log(this.postalModels);
    // this.cifService.preSave(this.cifModels);
  }
}
