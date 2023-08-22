import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { CashStatusItemService } from 'app/entities/cash-status-item/cash-status-item.service';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { IStatusItem } from 'app/entities/status-item/status-item.model';
import { firstValueFrom } from 'rxjs';
import { STATUS_TYPE } from 'app/shared/constants/status.constants';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-correction-application-info',
  templateUrl: './correction-application-info.component.html',
})
export class CorrectionApplicationInfoComponent {
  constructor() {}
}
@Component({
  selector: 'jhi-correction-application',
  templateUrl: './correction-application.component.html',
  styleUrls: ['./correction-application.scss'],
})
export class CorrectionApplicationComponent extends AbstractEntityMaterialComponent<ILoanApplication> implements OnInit {
  public displayColumns: string[] = ['no', 'applicationNumber', 'cif', 'customerName', 'internalName', 'status', 'action'];
  public currentSearch: string;
  public selectedFilterPositionTypes: string[];
  public selectedFilterStatusItems: string[];
  public positionTypes: IPositionType[];
  public statusItems: IStatusItem[];
  constructor(
    private cashCreditProposalService: CashCreditProposalService,
    protected _snackbar: MatSnackBar,
    private clipboard: Clipboard,
    private positionTypeService: PositionTypeService,
    private cashStatusItemService: CashStatusItemService,
    private dialog: MatDialog
  ) {
    super(_snackbar, cashCreditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.currentSearch = '';
    this.selectedFilterPositionTypes = [];
    this.selectedFilterStatusItems = [];
  }

  ngOnInit(): void {
    this.items = null;
    this.loading = false;
    this.loadPositionType();
    this.loadStatusItem();
  }

  public loadAll(text: string = null, roleIds: string[] = null, applicationStatuses: string[] = null): void {
    let _roleIds: string[] = [];
    let _applicationStatuses: string[] = [];
    if (roleIds && roleIds.length > 0) {
      const _selectedPositionTypes: string[] = this.selectedFilterPositionTypes;
      const _positionTypes = this.positionTypes;
      const filtered: IPositionType[] = lodash.filter(_positionTypes, function (o) {
        return lodash.includes(_selectedPositionTypes, o.id);
      });

      if (filtered.length > 0) {
        _roleIds = lodash.map(filtered, function (o) {
          return o.id;
        });
      }
    }

    // collect idstatusitem
    if (applicationStatuses && applicationStatuses.length > 0) {
      const _selectedStatusItem: string[] = this.selectedFilterStatusItems;
      const _statusItems = this.statusItems;
      const filtered: IStatusItem[] = lodash.filter(_statusItems, function (o) {
        return lodash.includes(_selectedStatusItem, o.id);
      });

      if (filtered.length > 0) {
        _applicationStatuses = lodash.map(filtered, function (o) {
          return o.id;
        });
      }
    }

    const param: object = {
      page: this.page,
      size: this.itemsPerPage,
      query: text,
      sort: this.sortData(),
    };

    if (_roleIds.length > 0) {
      param['idRoles'] = _roleIds;
    }

    if (_applicationStatuses.length > 0) {
      param['idStatusItems'] = _applicationStatuses;
    }

    this.cashCreditProposalService.getIncorrectData(param).subscribe(res => {
      this.initDataForMatTable(res, res.headers);
    });
  }

  private async loadPositionType() {
    this.positionTypes = (await firstValueFrom(this.positionTypeService.query({ page: 0, size: 9999 }))).body;
  }

  private async loadStatusItem() {
    this.statusItems = (
      await firstValueFrom(
        this.cashStatusItemService.filterBy({
          page: 0,
          size: 9999,
          idStatusType: STATUS_TYPE.CREDIT_PROPOSAL,
        })
      )
    ).body;
  }

  public filter() {
    this.items = null;
    this.loading = true;
    this.loadAll(this.currentSearch, this.selectedFilterPositionTypes, this.selectedFilterStatusItems);
  }

  public showSelectedPositions(id: string): string {
    if (id) {
      return lodash.find(this.positionTypes, function (o: IPositionType) {
        return o.id === id;
      }).description;
    }

    return '';
  }

  public showSelectedStatus(id: string): string {
    if (id) {
      return lodash.find(this.statusItems, function (o: IStatusItem) {
        return o.id === id;
      }).description;
    }

    return '';
  }

  protected postLoadDataLazy(): void {
    this.loading = true;
    this.loadAll(this.currentSearch, this.selectedFilterPositionTypes, this.selectedFilterStatusItems);
  }

  public search(): void {
    this.items = null;
    this.loading = true;
    this.loadAll(this.currentSearch);
  }

  public clear(): void {
    this.items = null;
    this.loading = true;
    this.currentSearch = '';
    this.loadAll(this.currentSearch, this.selectedFilterPositionTypes, this.selectedFilterStatusItems);
  }

  public copy(text: string): void {
    this.clipboard.copy(text);
    this._snackBar.open('copy ' + text + ' successfully to your clipboard', null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
  public openInfo(): void {
    this.dialog.open(CorrectionApplicationInfoComponent, {
      width: '800px',
    });
  }
}
