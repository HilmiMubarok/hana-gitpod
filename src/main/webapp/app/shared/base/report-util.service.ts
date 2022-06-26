import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ReportUtilService {
  constructor(private http: HttpClient) {}

  private viewBlob(title: string, data: any) {
    const win = window.open();
    // tslint:disable-next-line:max-line-length
    win!.document.write(
      '<html><head><title>' +
        title +
        '</title></head><body> <iframe src="' +
        data +
        '" frameborder="0" title="xxxxx" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );
  }

  private getFileName(response: any): string {
    const contentDispositionHeader: string = response.headers.get('content-disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    const fileName = parts[1].split('=')[1];
    return fileName;
  }

  downloadFile(api: string, req?: any) {
    const options = this.createReportRequestOption(req);
    this.http.get(api, { params: options, responseType: 'blob', observe: 'response' }).subscribe(response => {
      saveAs(response.body!, this.getFileName(response));
    });
  }

  viewFile(api: string, req?: any, title?: string) {
    const options = this.createReportRequestOption(req);
    if (title === undefined) {
      title = 'Report';
    }
    this.http.get(api, { params: options, responseType: 'blob', observe: 'response' }).subscribe(response => {
      const reader = new FileReader();
      reader.readAsDataURL(response.body!);
      reader.onloadend = e => {
        this.viewBlob(title!, reader.result);
      };
    });
  }

  private createReportRequestOption = (req?: any): HttpParams => {
    let options: HttpParams = new HttpParams();
    if (req) {
      Object.keys(req).forEach(key => {
        if (key !== 'sort') {
          options = options.set(key, req[key]);
        }
      });
      if (req.sort) {
        req.sort.forEach((val: string) => {
          options = options.append('sort', val);
        });
      }
    }
    return options;
  };
}
