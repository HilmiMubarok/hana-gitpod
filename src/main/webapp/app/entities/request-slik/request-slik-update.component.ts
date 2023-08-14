import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';

import { RequestSlik } from './request-slik.model';
import { RequestSlikService } from './request-slik.service';
import { AccountService } from 'app/core/auth/account.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { PartyCifService } from '../party-cif/party-cif.service';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestSlikStatus } from './enums/request-slik-status.enum';

@Component({
  selector: 'jhi-request-slik-update',
  templateUrl: './request-slik-update.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css', './request-slik.css', '../party-cif/party-cif.style.scss'],
})
export class RequestSlikUpdateComponent {
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
    this.accountService
      .identity()
      .pipe(map(user => user.login))
      .subscribe(user => (this.userLogin = user));
  }
  public displayedColumns: string[] = ['select', 'no', 'cif', 'customerName', 'customerType', 'createdDate'];
  public currentSearch;
  getValue(event) {
    this.currentSearch = event.target.value;
  }

  userLogin: string;
  createReqSlik() {
    if (this.selection.selected.length === 0) {
      this.toastService.add({
        severity: 'error',
        summary: 'Please select CIF',
      });
    } else {
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
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  partyCifs$: Observable<any>;
  public selection = new SelectionModel<any>(true, []);
  search() {
    this.partyCifs$ = this.partyCifService
      .findLikeCif(this.currentSearch, {
        page: 0,
        size: 999,
		idPosition: this.getLocStor('POS')
      })
      .pipe(map(res => res.body));
  }

  public previousState(): void {
    window.history.back();
  }
}
