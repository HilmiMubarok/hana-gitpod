import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-comparison-data-property',
  templateUrl: './collateral-appraisal-comparison-data-property.component.html',
  styleUrls: ['./collateral-appraisal-comparison-data.css'],
})
export class CollateralAppraisalComparisonDataPropertyComponent {
  // Initiation
  public items = [
    {
      indexNum: 1,
      typeProperty: 'Perumnas',
      luasTanah: '240',
      hargaPenawaran: '500.000.000',
      lokasi: 'Citayam',
      luasBangunan: '68',
      hargaTanah: '100.000.000',
    },
  ];
  public dialogAddVisible = false;
  public dialogEditVisible = false;
  public width = '90%';
  public height = 'auto';
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  // Model
  public typeProperty?: string;
  public luasTanah?: string;
  public hargaPenawaran?: string;
  public lokasi?: string;
  public luasBangunan?: string;
  public hargaTanah?: string;

  public onEdit(data: any): void {
    this.typeProperty = data.typeProperty;
    this.luasTanah = data.luasTanah;
    this.hargaPenawaran = data.hargaPenawaran;
    this.lokasi = data.lokasi;
    this.luasBangunan = data.luasBangunan;
    this.hargaTanah = data.hargaTanah;

    this.dialogEditVisible = true;
  }

  public onDelete(data: any): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public onAdd(): void {
    this.clearTextBox();
    this.dialogAddVisible = true;
    this.dialogEditVisible = false;
  }

  public onOverlayEditClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }
  public onOverlayAddClick(): void {
    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public addToGrid(): void {
    this.items = [
      ...this.items,
      {
        indexNum: this.items.length + 1,
        typeProperty: this.typeProperty,
        luasTanah: this.luasTanah,
        hargaPenawaran: this.hargaPenawaran,
        lokasi: this.lokasi,
        luasBangunan: this.luasBangunan,
        hargaTanah: this.hargaTanah,
      },
    ];

    this.clearTextBox();

    this.dialogAddVisible = false;
    this.dialogEditVisible = false;
  }

  public clearTextBox(): void {
    this.typeProperty = '';
    this.luasTanah = '';
    this.hargaPenawaran = '';
    this.lokasi = '';
    this.luasBangunan = '';
    this.hargaTanah = '';
  }
}
