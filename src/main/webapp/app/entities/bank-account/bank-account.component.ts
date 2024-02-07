import { Component, OnInit } from '@angular/core';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
// import { PartyCifFindOrCreateCifDialogComponent } from './dialogs/party-cif-find-or-create-cif-dialog.component';
import { Router } from '@angular/router';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CustomerService } from '../customer/customer.service';
import { ICustomer } from '../customer/customer.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPerson, Person } from '../person/person.model';
import { CUSTOMER_TYPE } from 'app/shared/constants/base.constants';
import { PersonService } from '../person/person.service';
import { PartyGroupService } from '../party-group/party-group.service';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { MessageService } from 'primeng/api';
import { LoginService } from 'app/login/login.service';
import { CashCustomersService } from '../customer-cash/customer-cash.service';
import { CashCustomerService } from './cash-cusomer.service';
import { TemplateService } from 'app/layouts/template/template.service';
import { PositionService } from '../position/position.service';

@Component({
  selector: 'jhi-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.style.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BankAccountComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit {
  get partyCifs() {
    return this.items;
  }

  set partyCifs(partyCif: IPartyCif[]) {
    this.items = partyCif;
  }

  public personalCustomer: IPerson;
  public corporateCustomer: IPartyGroup;
  public displayedColumns: string[] = ['no', 'cif', 'customerName', 'customerType', 'createdDate', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public expandedElement: IPartyCif | null;
  public activeRoute: string;
  public statusCodesData: Object[] = [];
  public debtorData: IDebtorData;
  private positionIdLocStor: string;
  public positionTypeId: string;

  constructor(
    protected partyCifService: PartyCifService,
    protected _snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected router: Router,
    protected applicationConfigService: ApplicationConfigService,
    protected customerService: CustomerService,
    protected personService: PersonService,
    protected corporateService: PartyGroupService,
    protected messageService: MessageService,
    protected loginService: LoginService,
    protected cashCustomersService: CashCustomersService,
    private cashCustomerService: CashCustomerService,
    protected templateService: TemplateService,
    private positionService: PositionService
  ) {
    super(_snackBar, customerService, messageService);

    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.activeRoute = this.router.url.replace(/\//g, '');
    this.personalCustomer = null;
    this.corporateCustomer = null;
  }

  ngOnInit(): void {
    this.positionIdLocStor = this.getPositionByLocStor('POS');
    this.getPositionTypeId();
    if (!this.positionIdLocStor) {
      this.logout();
    } else {
      this.loadAll();
    }
  }

  // public openDialogFindCif(): void {
  //   const dialog = this.dialog.open(PartyCifFindOrCreateCifDialogComponent, {
  //     width: '80vw',
  //   });
  //   dialog.afterClosed().subscribe(res => {
  //     if (res) {
  //       this.loadAll();
  //     }
  //   });
  // }

  protected postLoadDataLazy(): void {
    if (this.currentSearch === '' || this.currentSearch === undefined || this.currentSearch === null) {
      this.loadAll();
    } else {
      this.search();
    }
  }

  private getPositionTypeId(): void {
    this.positionService.find(this.getLocStor('POS')).subscribe(res => {
      this.positionTypeId = res.body.positionTypeId;
    });
  }

  public search() {
    this.statusSearch = true;
    this.cashCustomerService
      .cashCustomers({
        page: this.page,
        query: this.currentSearch,
        size: this.itemsPerPage,
        idPosition: this.getLocStor('POS'),
        sort: this.sortData(),
      })
      .pipe(map((res: HttpResponse<IPartyCif[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
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

  public cifNumber: any;

  public updateFromHobis(data: any): void {
    this.cifNumber = data.customerId;
    if (this.cifNumber !== undefined) {
      this.partyCifService.syncUpdateHobis(this.cifNumber).subscribe({
        next: res => {
          if (res.body) {
            for (let i = 0; i < this.partyCifs.length; i++) {
              this.partyCifs[i] = res.body;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'SYNC Update From Hobis Successful!',
            });
          }
        },
        error: (res: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.error.title,
          });
        },
      });
    }
  }

  public findDetail(element: ICustomer): void {
    if (element) {
      this.personalCustomer = new Person();
      this.corporateCustomer = new PartyGroup();
      if (element.customerType === CUSTOMER_TYPE.PERSONAL.toString()) {
        this.personService.find(element.partyId).subscribe(res => {
          this.personalCustomer = res.body;
        });
      } else if (element.customerType === CUSTOMER_TYPE.CORPORATE.toString()) {
        this.corporateService.find(element.partyId).subscribe(res => {
          this.corporateCustomer = res.body;
        });
      }
    }
  }

  public statusSearch = false;
  public closeSearch() {
    this.statusSearch = false;
    this.currentSearch = '';
    this.page = 0;

    this.itemsPerPage = 0;
    this.loadAll();
  }

  private logout(): void {
    this.templateService.changePosInt('Empty');
    // this.loginService.logout();
    this.router.navigate(['']);
  }

  private getPositionByLocStor(cookieName: string) {
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

  private loadAll(): void {
    this.loading = true;
    this.cashCustomersService
      .query({
        idPosition: this.positionIdLocStor,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.statusCodesData, event.previousIndex, event.currentIndex);
  }

  private loadData() {
    this.loading = true;
    if (this.currentSearch) {
      this.partyCifService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<IPartyCif[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res.body, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.partyCifService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public data: [];

  previousState(): void {
    window.history.back();
  }
}
