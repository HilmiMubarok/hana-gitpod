import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'jhi-tab-summary-dialog-view',
  templateUrl: './tab-summary-dialog-view.component.html',
  styleUrls: ['./tab-summary-dialog-view.component.scss'],
})
export class TabSummaryDialogViewComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  public service = 'https://ej2services.syncfusion.com/production/web-services/api/pdfviewer';
  public document;

  @ViewChild('pdfViewer') pdfViewer;

  constructor(
    private storageService: StorageService,
    private _dialog: MatDialogRef<TabSummaryDialogViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.documentLoad();
  }

  documentLoad($event?: any) {
    // const viewer = (<any>document.getElementById('pdfViewer')).ej2_instances[0];
    //   viewer.load(this.data?.file, null);
    // eslint-disable-next-line no-var
    // var viewer = <any>document.getElementById('pdfViewer');
    // this.pdfViewer.load(this.data?.file, null);

    console.log(this.pdfViewer)
  }
}
