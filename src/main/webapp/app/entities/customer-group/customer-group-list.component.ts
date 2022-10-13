import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IPartyCif } from '../party-cif/party-cif.model';
import { CustomerGroupDialogComponent } from './customer-group-dialog.component';
import { CustomerGroup, ICustomerGroup } from './customer-group.model';
import { CustomerGroupService } from './customer-group.service';

@Component({
  selector: 'jhi-customer-group-list',
  templateUrl: './customer-group-list.component.html',
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
export class CustomerGroupListComponent extends AbstractEntityMaterialComponent<ICustomerGroup> implements OnChanges {
  @Input()
  public partyCif: IPartyCif;

  get dataSource() {
    return this.items;
  }
  set dataSource(param: ICustomerGroup[]) {
    this.items = param;
  }

  public displayedColumns: string[] = ['no', 'name', 'cif', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public expandedElement: ICustomerGroup | null;

  constructor(protected _snackbar: MatSnackBar, protected customerGroupService: CustomerGroupService, protected dialog: MatDialog) {
    super(_snackbar, customerGroupService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      this.loadAll(this.getPartyId());
    }
  }

  public openDelete(element: ICustomerGroup): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '80vw',
      data: {
        title: 'Delete Grup Usaha',
        message: 'Are you sure to delete this data?',
      },
    });
    dialogRef.afterClosed().subscribe((res: ICustomerGroup) => {
      if (res) {
        this.customerGroupService.delete(element.id).subscribe(res2 => {
          this.loadAll(this.getPartyId());
        });
      }
    });
  }

  public findDetailCustomerGroup(element: ICustomerGroup): void {}

  private getPartyId(): string {
    return this.partyCif.customerOrganization ? this.partyCif.customerOrganization.id : this.partyCif.customerPerson.id;
  }

  public loadAll(partyIdFrom: string): void {
    this.customerGroupService
      .queryFilterBy({
        page: this.page,
        size: this.itemsPerPage,
        partyFromId: partyIdFrom,
        sort: ['id,desc'],
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll(this.partyCif.customerId);
  }

  public openDialog(element: ICustomerGroup = null): void {
    let value: ICustomerGroup;
    value = new CustomerGroup();
    value.partyIdFrom = this.getPartyId();
    value.cifFrom = this.partyCif.customerNumber;

    if (element) {
      value = element;
    }

    const dialogRef = this.dialog.open(CustomerGroupDialogComponent, {
      width: '80vw',
      data: {
        customerGroup: value,
        view: element ? true : false,
      },
    });
    dialogRef.afterClosed().subscribe((res: ICustomerGroup) => {
      if (res) {
        this.customerGroupService.create(res).subscribe(res2 => {
          this.loadAll(this.getPartyId());
        });
      }
    });
  }
}
