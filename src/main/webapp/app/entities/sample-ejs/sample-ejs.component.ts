import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'jhi-service-sample-ejs',
  templateUrl: './sample-ejs-two.component.html',
  styleUrls: ['./sample-ejs.style.css'],
})
export class SampleEjsComponent implements OnInit {
  public storageBucket: String = 'hana';

  @ViewChild('spreadsheet')
  public spreadsheetObj: SpreadsheetComponent;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    console.log('xxx');
  }

  public save(): void {
    this.spreadsheetObj.saveAsJson().then(data => {
      console.log('data', data['jsonObject']);
    });
  }
}
