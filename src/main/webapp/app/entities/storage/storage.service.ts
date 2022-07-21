import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/storage');
  }

  public upload(bucket: string, formData: FormData): Observable<HttpResponse<Object>> {
    // upload file to backend
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/files', formData, { observe: 'response' });
  }

  public getBucket(): Observable<HttpResponse<string>> {
    // query untuk mendapatkan bucket yang digunakan
    return this.http.get<string>(this.resourceUrl + '/bucket', { observe: 'response' });
  }

  public getObjects(bucket: string, queryParam: HttpParams): Observable<HttpResponse<Object[]>> {
    // query untuk mendapatkan list file
    return this.http.get<Object[]>(this.resourceUrl + '/' + bucket + '/object', { observe: 'response', params: queryParam });
  }
}
