import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';
import { ISurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { firstValueFrom } from 'rxjs';
import lodash from 'lodash';

@Component({
  selector: 'jhi-correction-appraisal-info',
  templateUrl: './correction-appraisal-info.component.html',
})
export class CorrectionAppraisalInfoComponent {
  constructor() {}
}

@Component({
  selector: 'jhi-correction-appraisal',
  templateUrl: './correction-appraisal.component.html',
})
export class CorrectionAppraisalComponent extends AbstractEntityMaterialComponent<ISurveyAppraisals> implements OnInit {
  public displayColumns: string[] = ['no', 'appraisalNumber', 'cif', 'customerName', 'status', 'action'];
  public currentSearch: string;
  public positionTypes: IPositionType[];
  public selectedFilterPositionTypes: string[];

  constructor(
    private cashSurveyAppraisalsService: CashSurveyAppraisalsService,
    private _snackbar: MatSnackBar,
    private positionTypeService: PositionTypeService,
    private clipboard: Clipboard,
    public dialog: MatDialog
  ) {
    super(_snackbar, cashSurveyAppraisalsService);
    this.currentSearch = '';
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.selectedFilterPositionTypes = [];
  }

  ngOnInit(): void {
    this.loadAll(this.currentSearch);
    this.loadPositionType();
  }

  private async loadPositionType() {
    this.positionTypes = (await firstValueFrom(this.positionTypeService.query({ page: 0, size: 9999 }))).body;
  }

  protected postLoadDataLazy(): void {
    this.loading = true;
    this.loadAll(this.currentSearch);
  }

  public search(): void {
    this.items = null;
    this.loading = true;
    this.loadAll(this.currentSearch);
  }

  public openInfo(): void {
    this.dialog.open(CorrectionAppraisalInfoComponent, {
      width: '800px',
    });
  }

  public clear(): void {
    this.items = null;
    this.loading = true;
    this.currentSearch = '';
    this.loadAll(this.currentSearch);
  }

  public filter() {
    this.items = null;
    this.loading = true;
    this.loadAll(this.currentSearch, this.selectedFilterPositionTypes);
  }

  public showSelectedPositions(id: string): string {
    if (id) {
      return lodash.find(this.positionTypes, function (o: IPositionType) {
        return o.id === id;
      }).description;
    }

    return '';
  }

  public loadAll(text: string = null, excludeStatus: string[] = null): void {
    let _excludeStatuses: string[] = [];
    if (excludeStatus && excludeStatus.length > 0) {
      const _selectedPositionTypes: string[] = this.selectedFilterPositionTypes;
      const _positionTypes = this.positionTypes;
      const filtered: IPositionType[] = lodash.filter(_positionTypes, function (o) {
        return lodash.includes(_selectedPositionTypes, o.id);
      });

      if (filtered.length > 0) {
        _excludeStatuses = lodash.map(filtered, function (o) {
          return o.id;
        });
      }
    }

    const param: object = {
      page: this.page,
      size: this.itemsPerPage,
      query: text,
      excludeAppraisalRoleIds: _excludeStatuses,
      sort: this.sortData(),
    };

    this.cashSurveyAppraisalsService.getIncorrectData(param).subscribe(res => {
      this.initDataForMatTable(res, res.headers);
    });
  }

  public copy(text: string): void {
    this.clipboard.copy(text);
    this._snackBar.open('copy ' + text + ' successfully to your clipboard', null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
}
