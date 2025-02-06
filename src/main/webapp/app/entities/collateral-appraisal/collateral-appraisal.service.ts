import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ICollateralAppraisal } from './collateral-appraisal.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';

import { Subject } from 'rxjs';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollateralAttribute, ICollateral } from '../collateral/collateral.model';
import lodash from 'lodash';
import { ScoreCard } from './negative/score-card.constant';
// import { scoreCard } from './negative/score-card.constant';

@Injectable({ providedIn: 'root' })
export class CollateralAppraisalService extends AbstractEntityService<ICollateralAppraisal> {
  public totalDataComparison: ICollateralProperty[];
  public totalDataFotoObjectJaminan: object[];
  public totalDataCollateralInfo: object[];
  public totalDataDocumentCollateral: ICollateral[];
  public totalDataDocumentLainya: ICollateralAppraisal[];
  public totalDataDetailBuilding: ICollateralProperty[];
  public totalCertificate: ICollateralProperty[];
  public totalDataDetailLand: ICollateralProperty[];
  public totalDataDetailVehicle: ICollateralProperty[];
  public totalDataDetailMachine: ICollateralProperty[];
  public totalDataValuationBuilding: ICollateralProperty[];
  public totalDataValuationLand: ICollateralProperty[];
  public totalDataValuationVehicle: ICollateralProperty[];
  public totalDataValuationMachine: ICollateralProperty[];
  public valuationData: any[];

  public collateralProperty: ICollateralProperty[];
  public collateralPropertyMod: any;
  public collateralPropertyChange: Subject<ICollateralProperty[]> = new Subject<ICollateralProperty[]>();
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.totalDataComparison = [];
    this.totalDataFotoObjectJaminan = [];
    this.totalDataCollateralInfo = [];
    this.totalDataDocumentCollateral = [];
    this.totalDataDocumentLainya = [];
    this.totalDataDetailBuilding = [];
    this.totalCertificate = [];
    this.totalDataDetailLand = [];
    this.totalDataDetailMachine = [];
    this.totalDataDetailVehicle = [];
    this.totalDataValuationBuilding = [];
    this.totalDataValuationLand = [];
    this.totalDataValuationMachine = [];
    this.totalDataValuationVehicle = [];
    this.valuationData = [];
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor('services/los/api/collateral-appraisals');
    this.resourceUrl = this.applicationConfigService.getEndpointFor('services/los/api/collateral-appraisals');
    this.resourceSearchUrl = this.applicationConfigService.getEndpointFor('services/los/api/_search/collateral-appraisals');
    this.resourceUrlCash = this.applicationConfigService.getEndpointFor('services/los/api/cash-collateral-appraisals');
    this.collateralPropertyChange.subscribe(collateralProperty => {
      this.collateralProperty = collateralProperty;
      for (let i = 0; i < this.collateralProperty.length; i++) {
        this.collateralPropertyMod = this.collateralProperty[i];
        this.collateralPropertyMod['indexNum'] = i + 1;
      }
    });
  }

  protected isNew(entity: ICollateralAppraisal): boolean {
    return entity.id === undefined || entity.id === null;
  }

  protected convertDateFromServer(res: HttpResponse<ICollateralAppraisal>): HttpResponse<ICollateralAppraisal> {
    res.body.collateralTypeId = res.body.collateral != null ? parseInt(res.body.collateral.collateralTypeId, 10) : null;
    res.body.collateralTypeDescription = res.body.collateral != null ? res.body.collateral.collateralTypeDescription : null;
    res.body.fromDate = res.body.fromDate != null ? new Date(res.body.fromDate) : null;
    res.body.thruDate = res.body.thruDate != null ? new Date(res.body.thruDate) : null;
    return res;
  }

  protected convertDateArrayFromServer(res: HttpResponse<ICollateralAppraisal[]>): HttpResponse<ICollateralAppraisal[]> {
    res.body.forEach((collateralAppraisal: ICollateralAppraisal) => {
      collateralAppraisal.collateralTypeId =
        collateralAppraisal.collateral !== null ? parseInt(collateralAppraisal.collateral.collateralTypeId, 10) : null;
      collateralAppraisal.collateralTypeDescription =
        collateralAppraisal.collateral !== null ? collateralAppraisal.collateral.collateralTypeDescription : null;
      collateralAppraisal.fromDate = collateralAppraisal.fromDate != null ? new Date(collateralAppraisal.fromDate) : null;
      collateralAppraisal.thruDate = collateralAppraisal.thruDate != null ? new Date(collateralAppraisal.thruDate) : null;
    });
    return res;
  }

  public customGet(param: any): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(`${this.resourceUrl}/${param}`, { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => this.preLoadItem(res)));
  }

  protected preSave(entity: ICollateralAppraisal) {}

  public setCollateralProperty(collateralProperty: ICollateralProperty[]): void {
    this.collateralPropertyChange.next(collateralProperty);
  }

  public mapper(param: ICollateralAppraisal): ICollateralAppraisal {
    if (!param.collateral.attributes) {
      param.collateral.attributes = new CollateralAttribute();
    }

    if (!lodash.has(param.attributes, 'jenisObject')) {
      param.attributes['jenisObject'] = '';
    }
    if (!lodash.has(param.attributes, 'marketbility')) {
      param.attributes['marketbility'] = '';
    }
    if (param.attributes === undefined || param.attributes === null || typeof param.attributes['scoreCard'] === 'string') {
      param.attributes['scoreCard'] = JSON.parse(param.attributes['scoreCard']);
      // param.attributes['summary'] = {
      //   keterangan: '',
      //   marketbility: '',
      //   returnNotes: '',
      // };
    } else {
      if (!Object.prototype.hasOwnProperty.call(param.attributes, 'scoreCard')) {
        param.attributes['scoreCard'] = new ScoreCard();
      } else {
        param.attributes['scoreCard'] = JSON.parse(param.attributes['scoreCard']);
      }

      // if (!Object.prototype.hasOwnProperty.call(param.attributes, 'summary')) {
      //   param.attributes['summary'] = {
      //     keterangan: '',
      //     marketbility: '',
      //     returnNotes: '',
      //   };
      // } else {
      //   param.attributes['summary'] = JSON.parse(param.attributes['summary']);
      // }
    }
    return param;
  }
}
