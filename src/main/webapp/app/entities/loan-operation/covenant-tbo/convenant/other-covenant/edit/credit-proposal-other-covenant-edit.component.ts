import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from '../other-convenant.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-other-covenant-edit-loan',
  templateUrl: './credit-proposal-other-covenant-edit.component.html',
  styleUrls: ['../other-covenant.css'],
})
export class CreditProposalOtherCovenantEditTempComponent implements OnInit {
  public otherCovenant: IOtherCovenant;
  public edit: boolean;
  item: ICreditProposal;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      otherCovenant: IOtherCovenant;
      edit: boolean;
      item: ICreditProposal;
    },
    private _dialog: MatDialogRef<CreditProposalOtherCovenantEditTempComponent>,
    protected generalParameterService: GeneralParameterService,
    private dialog: MatDialog
  ) {
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
  }

  ngOnInit(): void {
    this.subCategoryValue(this.data.otherCovenant.categoryId);
    this.checkRole();
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

  public checkRole() {
    this._dialog.disableClose = true;
    this._dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
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
    this._dialog.close(this.otherCovenant);
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
        this._dialog.close();
      }
    });
  }
}
