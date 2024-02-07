import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-generate-draft-dppk',
  templateUrl: './generate-draft-dppk.component.html',
  styleUrls: ['./generate-draft-dppk.component.scss'],
})
export class GenerateDraftDppkComponent implements OnInit {
  public dataSource = [];

  public displayColumns: string[] = ['no', 'fileName', 'date', 'createBy', 'sizeFile', 'action'];

  constructor() {}

  ngOnInit(): void {
    console.log('test bank account');
  }
}
