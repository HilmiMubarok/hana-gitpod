import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

@Injectable({
  providedIn: 'root',
})
export class SLAReviewerService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getReviewerName() {
    const positions = ['CRO', 'CRO_NONSME'];
    const params = new HttpParams().set('page', 0).set('size', 99999).set('sort', 'id,desc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/positions'), {
        params,
        observe: 'response',
      })
      .pipe(
        map(res => res.body),
        map(employees =>
          employees.filter(
            (employee: any) =>
              positions.includes(employee.positionTypeId) && employee.statusId === 'ACTIVE' && employee.statusIdEmployee === 'ACTIVE'
          )
        )
      );
  }

  getApprovalLc() {
    const parentIds = ['SME', 'BTB', 'COMMERCIAL', 'CORPORATE', 'GLOBALBS'];
    const params = new HttpParams().set('idParent', 'LOS_REL').set('page', 0).set('size', 99999);

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.MASTERCONTROL + '/api/relation-types/filterBy'), {
        params,
        observe: 'response',
      })
      .pipe(
        map(res => res.body),
        map(relationTypes => relationTypes.filter((relationType: any) => parentIds.includes(relationType.parentId)))
      );
  }
}
