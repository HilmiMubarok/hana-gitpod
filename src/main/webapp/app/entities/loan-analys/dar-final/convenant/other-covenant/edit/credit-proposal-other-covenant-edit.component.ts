import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from '../other-convenant.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-other-covenant-edit-temp',
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
    protected generalParameterService: GeneralParameterService
  ) {
    this.edit = this.data.edit;
    this.otherCovenant = this.data.otherCovenant;
    this.item = this.data.item;
  }

  ngOnInit(): void {
    this.subCategoryValue(this.data.otherCovenant.categoryId);
  }

  public categorys = [
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_OTHER',
      parameterTypeDescription: 'Other Covenant Category Other',
    },
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_NOTES',
      parameterTypeDescription: 'Other Covenant Category Notes',
    },
    {
      parameterTypeId: 'OTHER_COVENANT_CATEGORY_CONDITION',
      parameterTypeDescription: 'Other Covenant Category Condition',
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
    this._dialog.close(this.otherCovenant);
  }
}
