import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { utils, WorkSheet, writeFile } from 'xlsx';

@Injectable({ providedIn: 'root' })
export class MisReportService {
  constructor(private http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  private loadingGenerateDocument: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private generateDocumentLabel: BehaviorSubject<string> = new BehaviorSubject<string>('Generate');

  public loadingGenerateDocument$ = this.loadingGenerateDocument.asObservable();
  public generateDocumentLabel$ = this.generateDocumentLabel.asObservable();

  generateMisReport(
    templateData: Array<{ key: string; valueFrom: string; format: string }>,
    generateServiceCall: Observable<HttpResponse<any>>,
    fileNamePrefix = 'MIS Credit Report',
    sheetName = 'Data'
  ): Observable<void> {
    return new Observable<void>(observer => {
      // set loading and label
      this.loadingGenerateDocument.next(true);
      this.generateDocumentLabel.next('Generating...');

      const date = new Date();
      const fileName = `${fileNamePrefix}_${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}.xlsx`;

      generateServiceCall.subscribe({
        next: (res: HttpResponse<any>) => {
          const data = this.processDataForDocument(res.body, templateData);

          console.log(data);

          const ws = utils.json_to_sheet(data);

          // Set column width to auto size as content
          ws['!cols'] = this.autofitColumns(
            data,
            ws,
            templateData.map(t => t.key)
          );

          const wb = utils.book_new();
          utils.book_append_sheet(wb, ws, sheetName);

          writeFile(wb, fileName, { bookType: 'xlsx', cellStyles: true });

          observer.next(); // Emit success
          observer.complete(); // Complete the observable
          this.loadingGenerateDocument.next(false);
          this.generateDocumentLabel.next('Generate Document');
        },
        error: error => {
          observer.error(); // Emit error
          this.loadingGenerateDocument.next(false);
          this.generateDocumentLabel.next('Generate Document');
        },
      });
    });
  }

  private autofitColumns(json: any[], worksheet: WorkSheet, header?: string[]) {
    const jsonKeys = header ? header : Object.keys(json[0]);

    const objectMaxLength = [];
    for (let i = 0; i < json.length; i++) {
      const value = json[i];
      for (let j = 0; j < jsonKeys.length; j++) {
        if (typeof value[jsonKeys[j]] === 'number') {
          objectMaxLength[j] = 10;
        } else {
          const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

          objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
        }
      }

      const key = jsonKeys;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] = objectMaxLength[j] >= key[j].length ? objectMaxLength[j] : key[j].length;
      }
    }

    const wscols = objectMaxLength.map(w => ({ width: w }));

    return wscols;
  }

  private processDataForDocument(data: any[], templateData: Array<{ key: string; valueFrom: string; format: string }>): any[] {
    return data.map((item, index) => {
      const row = {};
      templateData.forEach(template => {
        if (template.format === 'date') {
          row[template.key] = item[template.valueFrom]
            ? `${new Date(item[template.valueFrom]).getDate()}/${new Date(item[template.valueFrom]).getMonth() + 1}/${new Date(
                item[template.valueFrom]
              ).getFullYear()}`
            : '';
        } else if (template.format === 'string') {
          if (template.key === 'No.') {
            row[template.key] = index + 1;
          } else {
            row[template.key] = item[template.valueFrom] ?? '';
          }
        }
      });
      return row;
    });
  }

  public getMisReportCP(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/credit-proposal/`,
      params,
      { observe: 'response' }
    );
  }

  public getMisReportCPFacility(params): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS)}/api/mis/report/credit-proposal-detail-facility/`,
      params,
      { observe: 'response' }
    );
  }

  public getStatuses(appMenuId: string) {
    const params = new HttpParams().set('appMenuId', appMenuId).set('page', 0).set('sort', 'id,asc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-status-item') + '/filterBy', {
        params,
        observe: 'response',
      })
      .pipe(map(res => res.body));
  }
  public getStatusCpMapping() {
    const params = new HttpParams().set('appMenuId', 'MIS_CREDIT_PROPOSAL_TIMELINE').set('page', 0).set('sort', 'id,asc');

    return this.http
      .get<any>(this.applicationConfigService.getEndpointFor(MICROSERVICENAME.LOS + '/api/app-menu-status-item') + '/filterBy', {
        params,
        observe: 'response',
      })
      .pipe(map(res => res.body));
  }
}
