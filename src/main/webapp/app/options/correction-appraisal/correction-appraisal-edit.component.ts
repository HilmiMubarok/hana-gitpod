import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CashPositionService } from 'app/entities/cash-position/cash-position.service';
import { IPosition } from 'app/entities/position/position.model';
import { ISurveyAppraisals, SurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { SurveyAppraisalsService } from 'app/entities/survey-appraisals/survey-appraisals.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
import { STATUS } from 'app/shared/constants/status.constants';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { CorrectionAppraisalService } from './correction-appraisal.service';
import { CorrectionAppraisal, ICorrectionAppraisal } from './correction-appraisal.model';
import { STATUS_CODES } from 'http';

@Component({
  selector: 'jhi-correction-appraisal-edit',
  templateUrl: './correction-appraisal-edit.component.html',
})
export class CorrectionAppraisalEditComponent extends AbstractEntityMaterialComponent<IPosition> implements OnInit {
  public displayColumns: string[] = ['no', 'internal', 'name', 'select'];
  public surveyAppraisal: ISurveyAppraisals;
  public idAppraisal: number;
  public positions: IPosition[];

  constructor(
    private route: ActivatedRoute,
    private surveyAppraisalService: SurveyAppraisalsService,
    private cashPositionService: CashPositionService,
    private correctionAppraisalService: CorrectionAppraisalService,
    private _snackbar: MatSnackBar,
    private router: Router
  ) {
    super(_snackbar, surveyAppraisalService);
    this.route.paramMap.subscribe(params => {
      this.idAppraisal = parseInt(params.get('id'), 10);
    });
    this.surveyAppraisal = new SurveyAppraisals();
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.getById().then(() => {
      this.getPositions();
    });
  }

  private async getById(): Promise<void> {
    this.surveyAppraisal = (await firstValueFrom(this.surveyAppraisalService.find(this.idAppraisal))).body;
  }

  private async getPositions(): Promise<void> {
    const statusId: string = this.surveyAppraisal.statusId;
    let param: object = {};
    param = {
      page: this.page,
      size: this.itemsPerPage,
      sort: ['id', 'desc'],
    };
    switch (statusId) {
      case STATUS.ASSIGNMENT: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.ADMIN_APPRAISER;
        break;
      }
      case STATUS.RETURNTORM: {
        param['active'] = true;
        param['idParty'] = this.surveyAppraisal.ownerPosition.partyId;
        param['idPositionType'] = POSITION_TYPE.RM;
        break;
      }
      case STATUS.ASSIGNED: {
        param['active'] = true;
        param['idPosition'] = this.surveyAppraisal.surveyorPositionId;
        param['idPositionType'] = POSITION_TYPE.SURVEYOR;
        break;
      }
      case STATUS.RETURNTOADMIN: {
        param['active'] = true;
        param['idPositionType'] = POSITION_TYPE.ADMIN_APPRAISER;
        break;
      }
      default: {
        param = {};
        break;
      }
    }

    const resp: HttpResponse<IPosition[]> = await firstValueFrom(this.cashPositionService.filterBy(param));
    this.initDataForMatTable(resp, resp.headers);
  }

  protected manipulateData(data: IPosition[]): Object[] {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['checked'] = false;
      }
    }
    return data;
  }

  public save(data: MatTableDataSource<IPosition>): void {
    const filterSelectedPositions: IPosition[] = lodash.filter(data.filteredData, function (o) {
      return o['checked'] === true;
    });

    const correctionAppraisal: ICorrectionAppraisal = new CorrectionAppraisal();
    correctionAppraisal.appraisalId = this.idAppraisal;
    correctionAppraisal.selectedPosition = filterSelectedPositions;

    this.correctionAppraisalService.create(correctionAppraisal).subscribe({
      next: res => {
        this.router.navigate(['/options/correction-appraisal']);
      },
      error: (err: HttpErrorResponse) => {
        this.showErrorWithSnackBarMaterial(err.error['detail']);
      },
    });
  }

  public loadDataLazy(): void {
    this.getPositions();
  }
}
