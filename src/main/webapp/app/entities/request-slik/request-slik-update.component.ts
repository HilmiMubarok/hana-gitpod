import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';

import { RequestSlikService } from './request-slik.service';
import { AccountService } from 'app/core/auth/account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestSlikStatus } from './enums/request-slik-status.enum';
import { CashCustomerService } from '../party-cif/cash-cusomer.service';
import { EmployeeService } from '../../entities/employee/employee.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
    private cashCustomerService: CashCustomerService,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.accountService.identity().subscribe(user => {
      const id = this.getLocStor('POS');
      this.userLogin = user.login;

      if (user) {
        this.employeeService
          .queryFilterBy({
            page: 0,
            query: 999,
            eqLogin: user.login,
            sort: ['id,desc'],
          })
          .pipe(
            map((res: HttpResponse<any[]>) => {
              const data = res.body[0].positions;
              return data.filter(p => p.id === Number(this.getLocStor('POS')));
            })
          )
          .subscribe({
            next: (res: any) => {
              this.requestor = res[0].positionTypeId;
              console.log('owner Position', this.requestor);
            },
            error: (res: HttpErrorResponse) => console.log('error ', res),
          });
      }
    });
  }
  public requestor: string;
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
        cif: this.selection.selected[0].customerId,
        ownerPosition: this.requestor,
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
    this.partyCifs$ = this.cashCustomerService
      .cashCustomers({
        page: 0,
        query: this.currentSearch,
        size: 999,
        idPosition: this.getLocStor('POS'),
      })
      .pipe(map(res => res.body));
  }

  public previousState(): void {
    window.history.back();
  }
}
