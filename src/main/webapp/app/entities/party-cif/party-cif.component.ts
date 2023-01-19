import { Component, OnInit } from '@angular/core';
import { IPartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { PartyCifFindOrCreateCifDialogComponent } from './dialogs/party-cif-find-or-create-cif-dialog.component';
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

@Component({
  selector: 'jhi-party-cif',
  templateUrl: './party-cif.component.html',
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
export class PartyCifComponent extends AbstractEntityMaterialComponent<IPartyCif> implements OnInit {
  get partyCifs() {
    return this.items;
  }

  set partyCifs(partyCif: IPartyCif[]) {
    this.items = partyCif;
  }

  public personalCustomer: IPerson;
  public corporateCustomer: IPartyGroup;
  public displayedColumns: string[] = ['no', 'cif', 'customerName', 'customerType', 'createdDate', 'action', 'hobis'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public expandedElement: IPartyCif | null;
  public activeRoute: string;
  public statusCodesData: Object[] = [];
  public debtorData: IDebtorData;

  constructor(
    protected partyCifService: PartyCifService,
    protected _snackBar: MatSnackBar,
    private dialog: MatDialog,
    protected router: Router,
    protected applicationConfigService: ApplicationConfigService,
    protected customerService: CustomerService,
    protected personService: PersonService,
    protected corporateService: PartyGroupService,
    protected messageService: MessageService
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
    this.loadAll();
  }

  public openDialogFindCif(): void {
    const dialog = this.dialog.open(PartyCifFindOrCreateCifDialogComponent, {
      width: '80vw',
    });
    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.loadAll();
      }
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public search() {
    this.loadAll();
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

  private loadAll(): void {
    this.loading = true;

    if (this.currentSearch && this.currentSearch !== '') {
      this.customerService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sortData(),
        })
        .pipe(map((res: HttpResponse<IPartyCif[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<IPartyCif[]>) => this.initDataForMatTable(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.customerService
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
  public cifNumber: any;
  public data: [];
  updateFromHobis() {
    this.cifNumber = this.expandedElement?.customerId;
    this.partyCifService.syncUpdateHobis(this.cifNumber).subscribe(res => {
      if (res.status === 200) {
        for (let i = 0; i < this.partyCifs.length; i++) {
          this.partyCifs[i] = res.body;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'SYNC Update From Hobis Successful!',
        });
      } else if (res.status === 500) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Update Data From HOBIS Failed!',
        });
      } else if (res.status === 404) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data From HOBIS Not Found!',
        });
      }
    });
  }

  updateFacilityFromHobis() {
    this.cifNumber = this.expandedElement?.customerId;
    this.partyCifService.find('cif/retrieve-cp-facility/' + this.cifNumber).subscribe(res => {
      if (res.status === 200) {
        this.data = JSON.parse(res.body.debtorData.attributes['cpFacility']);
        this.debtorData = res.body.debtorData;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error',
        });
      }
    });
  }
}
