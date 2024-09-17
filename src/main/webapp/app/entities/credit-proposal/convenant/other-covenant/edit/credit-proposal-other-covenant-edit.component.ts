import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from '../other-convenant.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

@Component({
  selector: 'jhi-other-covenant-edit',
  templateUrl: './credit-proposal-other-covenant-edit.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantEditComponent implements OnInit {
  public otherCovenant: IOtherCovenant;
  public edit: boolean;
  item: ICreditProposal;
  otherCovenantTemp: any;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      edit: boolean;
      item: ICreditProposal;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantEditComponent>,
    protected generalParameterService: GeneralParameterService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
    this.otherCovenantTemp = lodash.cloneDeep(this.data.otherCovenant);
  }
  ngOnInit(): void {
    this.subCategoryValue(this.data.otherCovenant.categoryId);
  }

  public categorys = [
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_OTHER',
      parameterTypeDescription: 'Other Covenant',
    },
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_NOTES',
      parameterTypeDescription: 'Notes',
    },
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_CONDITION',
      parameterTypeDescription: 'Condition',
    },
  ];

  public select: any;
  public onSelect(element: any): void {
    console.log(element);
    this.select = element;
    if (this.select) {
      this.subCategoryValue(this.select);
    }
  }

  public categoryCovenant = [];
  public subCategoryValue(id): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: id,
        page: 0,
        size: 9999,
        sort: ['code', 'asc'],
      })
      .subscribe(res => {
        this.categoryCovenant = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public save(): void {
    if (this.categorys.length) {
      for (let i = 0; i < this.categorys.length; i++) {
        if (this.select === this.categorys[i].parameterTypeId) {
          this.otherCovenant.categoryName = this.categorys[i].parameterTypeDescription;
        }
      }
    }
    this._dialog.close({ otherCovenant: this.otherCovenant, caption: 'save' });
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close({
          otherCovenant: this.otherCovenantTemp,
          caption: 'cancel',
        });
      }
    });
  }
}
