/* import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

interface IObject {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('/services/los/api/storage');
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

  public uploadMeta(bucket: string, formData: FormData, parameters: Object): Observable<HttpResponse<Object>> {
    const params = this.params(parameters);
    // 'http://localhost:9000/services/los/api/storage/hana/object/{meta}?objectName=folder%2Fktp.jpg' \
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/object/{meta}', formData, { params, observe: 'response' });
  }

  private params(parameters: IObject): HttpParams {
    return new HttpParams({ fromObject: parameters });
  }
}*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';

interface IObject {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
  }

  public upload(bucket: string, formData: FormData): Observable<HttpResponse<Object>> {
    // upload file to backend
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/files', formData, { observe: 'response' });
  }

  public getBucketName(): Observable<any> {
    return this.http.get<string>(this.resourceUrl + '/bucket', { observe: 'response' });
  }

  public getBucket(bucket: string): Observable<HttpResponse<string>> {
    // query untuk mendapatkan bucket yang digunakan
    return this.http.get<string>(this.resourceUrl + '/' + bucket + '/files', { observe: 'response' });
  }

  public getObjects(bucket: string, parameters: Object): Observable<HttpResponse<Object[]>> {
    // query untuk mendapatkan list file
    const params = this.params(parameters);
    return this.http.get<Object[]>(this.resourceUrl + '/' + bucket + '/object', { observe: 'response', params });
  }

  public uploadMeta(bucket: string, formData: FormData, parameters: Object): Observable<HttpResponse<Object>> {
    const params = this.params(parameters);
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/object/{meta}', formData, { params, observe: 'response' });
  }

  public delete(bucket, key: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.resourceUrl + '/' + bucket + '/files/' + key, { observe: 'response' });
  }

  private params(parameters: IObject): HttpParams {
    return new HttpParams({ fromObject: parameters });
  }
}
