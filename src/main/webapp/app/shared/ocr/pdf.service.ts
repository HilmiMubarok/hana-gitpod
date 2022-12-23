import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IPDFSlik } from './pdf-slik.model';
import { createRequestOption } from 'app/core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class PDFService {
  private resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.OCR + '/api/pdf');
  }

  public extractSlikFromFile(formData: FormData, params: object, partyId: string): Observable<HttpResponse<IPDFSlik[]>> {
    const options = createRequestOption(params);
    return this.http.post<IPDFSlik[]>(`${this.resourceUrl}/extractText/${partyId}`, formData, { params: options, observe: 'response' });
  }
}
