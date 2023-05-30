import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { AbstractEntityService } from 'app/shared/base/abstract-entity.service';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestSlikChecklistService extends AbstractEntityService<any> {
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected partyCifService: PartyCifService
  ) {
    super(http);
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/slik/request');
  }

  checklistOcrs: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  checklistOcrs$ = this.checklistOcrs.asObservable();

  updateChecklistOcrs(data: any) {
    const currentChecklistOcrs = this.checklistOcrs.getValue();
    currentChecklistOcrs.push(data);
    this.checklistOcrs.next(currentChecklistOcrs);
  }

  getAllChecklists() {
    const params = new HttpParams().set('page', 1).set('size', 99);
    return this.http.get(`${this.resourceUrl}/details`, { observe: 'response', params }).pipe(map(res => res.body));
  }
}
