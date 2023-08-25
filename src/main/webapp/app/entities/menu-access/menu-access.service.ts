import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuAccessService {
  menuPositionType;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.menuPositionType = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-position-type/groupBy/');
  }

  public getMenuAccess(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<any[]>(this.menuPositionType, { params: options, observe: 'response' });
  }
}
