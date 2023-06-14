import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IRequestSlik, RequestSlik } from './request-slik.model';
import { RequestSlikService } from './request-slik.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { PartyCifService } from '../party-cif/party-cif.service';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestSlikStatus } from './enums/request-slik-status.enum';

@Component({
  selector: 'jhi-request-slik-update',
  templateUrl: './request-slik-update.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css', './request-slik.css'],
})
export class RequestSlikUpdateComponent extends AbstractEntityUpdateComponent<IRequestSlik> {
  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected requestSlikService: RequestSlikService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    private partyCifService: PartyCifService,
    private router: Router
  ) {
    super(dataUtils, requestSlikService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'requestSlikListModification';
    this.partyCifs = [];
    this.accountService
      .identity()
      .pipe(map(user => user.login))
      .subscribe(user => (this.userLogin = user));
  }
  public displayedColumns: string[] = ['select', 'no', 'cif', 'customerName', 'customerType', 'createdDate'];
  public currentSearch;
  public partyCifs;
  getValue(event) {
    this.currentSearch = event.target.value;
  }

  userLogin: string;
  createReqSlik() {
    const data = {
      cif: this.selection.selected[0].customerNumber,
      requestor: this.userLogin,
      requestDate: new Date(),
      status: RequestSlikStatus.DRAFT,
      requestNumber: null,
    };
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.requestSlikService.create(data).subscribe(() => this.router.navigate(['request-slik']));
  }
  partyCifs$: Observable<any>;
  public selection = new SelectionModel<any>(true, []);
  search() {
    this.partyCifs$ = this.partyCifService
      .findLikeCif(this.currentSearch, {
        page: 0,
        size: 9999,
      })
      .pipe(map(res => res.body));
  }

  protected initialState(): any {
    return { item: new RequestSlik(), tasks: [], id: undefined };
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

  get requestSlik() {
    return this.item;
  }
}
