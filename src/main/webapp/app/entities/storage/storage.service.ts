import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { IDocumentNode } from '../document-node/document-node.model';

interface IObject {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  public resourceUrl: string;
  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/storage');
  }

  public update(bucket: string, body: object, parameters: object): Observable<HttpResponse<IDocumentNode[]>> {
    const params = this.params(parameters);
    return this.http.post<IDocumentNode[]>(`${this.resourceUrl}/${bucket}/object/update`, body, { observe: 'response', params });
  }

  public upload(bucket: string, formData: FormData): Observable<HttpResponse<Object>> {
    // upload file to backend
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/files', formData, { observe: 'response' });
  }

  public getBucketName(): Observable<HttpResponse<Object>> {
    return this.http.get<Object>(this.resourceUrl + '/bucket', { observe: 'response' });
  }

  public getBucket(bucket: string): Observable<HttpResponse<string>> {
    // query untuk mendapatkan bucket yang digunakan
    return this.http.get<string>(this.resourceUrl + '/' + bucket + '/files', { observe: 'response' });
  }

  public getObjects(bucket: string, parameters: Object): Observable<HttpResponse<Object[]>> {
    // query untuk mendapatkn list file
    const params = this.params(parameters);
    return this.http.get<Object[]>(this.resourceUrl + '/' + bucket + '/object', { observe: 'response', params });
  }

  public uploadMeta(bucket: string, formData: FormData, parameters: Object): Observable<HttpResponse<Object>> {
    const params = this.params(parameters);
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/object/{meta}', formData, { params, observe: 'response' });
  }

  public uploadMetaWithProgress(bucket: string, formData: FormData, parameters: Object): Observable<HttpEvent<any>> {
    const params = this.params(parameters);
    return this.http.post<Object>(this.resourceUrl + '/' + bucket + '/object/{meta}', formData, {
      params,
      observe: 'events',
      reportProgress: true,
    });
  }

  public delete(bucket, key: string): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.resourceUrl + '/' + bucket + '/files/' + key, { observe: 'response' });
  }

  public fileBlob(url): Observable<HttpResponse<Blob>> {
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

  private params(parameters: IObject): HttpParams {
    return new HttpParams({ fromObject: parameters });
  }

  public deleteFile(bucket: string, body: string): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.resourceUrl + '/' + bucket + '/deletefile', body, { observe: 'response' });
  }
}
