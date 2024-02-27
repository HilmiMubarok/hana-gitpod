import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IPosition } from './position.model';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({ providedIn: 'root' })
export class PositionService extends AbstractEntityService<IPosition> {
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/positions');
    this.resourceUrlNew = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cash-survey-appraisals');
    this.resourceUrlCash = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/cash-position');
    this.cashPositionResource = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/cash-positions');
  }

  protected isNew(entity: IPosition): boolean {
    return entity.id === undefined || entity.id === null;
  }

  public findByLogin(): Observable<HttpResponse<IPosition>> {
    return this.http.get<IPosition>(this.resourceUrl + '/get-by-login/', { observe: 'response' });
  }

  public findPositionReportingStructureAppraisal(idAppraisal: number) {
    return this.http.get<IPosition[]>(`${this.resourceUrlNew}/approval-user/${idAppraisal}`, {
      observe: 'response',
    });
  }

  public getPositionAssignTo(idPositionType: any, idInternal: string, req?: any) {
    const options = createRequestOption(req);
    return this.http.get<IPosition[]>(
      this.cashPositionResource + `/find-by/position-type/${idPositionType}/internal/${idInternal}/superordinate-internal`,
      {
        params: options,
        observe: 'response',
      }
    );
  }

  public getPositionAssignToMultiplePosition(idPositionType: any, idInternal: string, req?: any): Observable<HttpResponse<IPosition[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPosition[]>(
      `${this.cashPositionResource}/find-by/multiple-position-type/internal/${idInternal}/active?idPositionType=${idPositionType}`,
      {
        params: options, // Convert array to comma-separated string
        observe: 'response',
      }
    );
  }

  protected preSave(entity: IPosition) {}
}
