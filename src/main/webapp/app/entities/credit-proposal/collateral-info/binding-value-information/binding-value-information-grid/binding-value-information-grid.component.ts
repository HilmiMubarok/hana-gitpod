import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BindingValueInformationDialogComponent } from '../binding-value-information-dialog/binding-value-information-dialog.component';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import lodash from 'lodash';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-binding-value-information-grid',
  templateUrl: './binding-value-information-grid.component.html',
  styleUrls: ['../../collateral-info-cp.style.scss'],
})
export class BindingValueInformationGridComponent implements OnInit {
  constructor(
    private collateralService: CollateralService,
    private generalParameterService: GeneralParameterService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.lovBindingType();
  }

  _creditProposal: ICreditProposal;
  private _collateralSummaryData: ICollateral[];
  public bindingTypesHobies = [];

  @ViewChild('paginator') paginator: MatPaginator;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralSummaryData() {
    return this._collateralSummaryData;
  }

  set collateralSummaryData(item: ICollateral[]) {
    this._collateralSummaryData = item;
  }

  public displayedColumns: string[] = ['no', 'collateralType', 'address', 'bindingType', 'action'];

  public dataItem;
  public dataCollateral;

  public textBoxHidden = false;
  public statusDisabledOffering = false;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  ngOnInit(): void {
    this.loadByPartyId();
    this.conditionFieldInOfferingLetter();
  }

  private loadByPartyId(): void {
    this.collateralService
      .queryFilterBy({
        idParty: this.creditProposal.cif.partyId,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.dataCollateral = res.body;
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
      });
  }

  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypesHobies = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
    return '';
  }

  public getBindingType(element: ICollateral) {
    if (element.collBindingType && this.bindingTypesHobies.length > 0) {
      return this.bindingTypesHobies.find(obj => obj.code === element.collBindingType).value;
    }
  }

  public openDialog(element) {
    const dialogRef = this.dialog.open(BindingValueInformationDialogComponent, {
      width: '80vw',
      data: {
        item: element,
        creditProposaldata: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.type === 'save') {
        this.creditProposal.collaterals[this.creditProposal.collaterals.findIndex(obj => obj.id === res.item.id)] = res.item;
      }
    });
  }

  public conditionFieldInOfferingLetter() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    // Condition Offering Letter in Route Finalize
    if (this.parentPath === 'finalize') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = false;
      }

      // Condition Offering Letter in Route Distribution
    } else if (this.parentPath === 'distribution') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true;
      }

      // Condition Offering Letter in Route Review
    } else if (this.parentPath === 'review' || this.parentPath === 'confirmation') {
      if (this.selectedMenu === 'loan-facility-detail' || this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true; // Menambahkan perubahan di sini
      }
    } else if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'dar-revision-checker'
    ) {
      this.textBoxHidden = false;
      this.statusDisabledOffering = true;
    } else if (this.parentPath === 'dar-revision') {
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
      } else {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      }
    } else {
      this.textBoxHidden = true;
      this.statusDisabledOffering = true; // Menambahkan perubahan di sini
    }
  }
}
