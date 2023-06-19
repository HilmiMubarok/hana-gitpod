import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['./certificate-info.component.scss'],
})
export class CertificateInfoComponent {
  public dataItem = [];
  public displayedColumns: string[] = ['no', 'buktiKepemilikan', 'jangkaWaktu', 'luasTanah', 'luasBangunan'];
  constructor() {}
}
