import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

import { InsuranceInfoDialogComponent } from './dialog/insurance-info-dialog.component';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IInsuranceInformation, InsuranceInformation } from './insurance-information.model';
import { InsuranceInformationService } from './insurance-information.service';
import { IInsurance, Insurance } from '../party-cif/insurance-information-idd/insurance-information.model';
import { InsuranceInfoDialogDetailComponent } from './dialog/insurance-info-dialog-detail.component';
import { InsuranceDocumentComponent } from './document/insurance-document.component';
@Component({
  selector: 'jhi-grid-detail-insurance',
  templateUrl: './grid-detail-insurance.component.html',
  styleUrls: ['./dialog/insurance-info-dialog.css'],
})
export class GridDetailInsuranceComponent implements OnInit {
  public displayedColumns: string[] = ['no', 'insuranceType', 'companyName', 'expiredDate', 'action'];
  @ViewChild('paginator') paginator: MatPaginator;
  private _creditProposal: ICreditProposal;
  private _collateral: ICollateral;
  _insurance: IInsuranceInformation | null;
  @Output() dataInsurance = new EventEmitter();
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  @Input() parentSource?: String = '';
  public dataSource: any;
  dataItem: InsuranceInformation[];
  @Input()
  get insurance() {
    return this._insurance;
  }
  set insurance(items: IInsuranceInformation) {
    this._insurance = items;
  }
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  showAddButton;
  @Input() isViewMode;
  constructor(
    protected _snackbar: MatSnackBar,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private generalParameterService: GeneralParameterService,
    private insuranceInformationService: InsuranceInformationService
  ) {
    this._insurance = null;
  }

  ngOnInit(): void {
    const collateral = this.collateral.id;
    this.loadByPartyId(collateral);
    this.showAddButton = this.creditProposal.statusInsuranceId !== 'INSURANCE_COMPLETE';
  }
  private loadByPartyId(collateralId: number): void {
    this.insuranceInformationService.filterTableData(collateralId).subscribe(res => {
      this.dataItem = res.body;
      this.insuranceInformationService.dataSourceInsurance = this.dataItem;
      this.dataSource = new MatTableDataSource(this.dataItem);
      this.dataSource.paginator = this.paginator;
    });
  }
  public openDocument(element: any): void {
    this._insurance = element;
    this.dataInsurance.emit(this._insurance);
  }
  public openDialog(mode: string, element: IInsuranceInformation = null): void {
    let _insurance = new InsuranceInformation();
    if (element) {
      _insurance = element;
    }
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: this.collateral,
        insurance: _insurance,
        isViewMode: this.isViewMode,
        parentSource: this.parentSource,
        mode,
      },
    };
    const dialogRef = this.dialog.open(InsuranceInfoDialogDetailComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const collateralId = this.collateral.id;
      if (res) {
        if (res.id) {
          this.insuranceInformationService.update(res).subscribe(_res => {
            _res.body.collateralId = collateralId;
            this.loadByPartyId(collateralId);
            this.insuranceInformationService.dataSourceInsurance.push(_res.body);
          });
        } else {
          this.insuranceInformationService.create(res).subscribe(_res => {
            this.loadByPartyId(collateralId);
            this.insuranceInformationService.dataSourceInsurance.push(_res.body);
          });
        }
      }
    });
  }
}
