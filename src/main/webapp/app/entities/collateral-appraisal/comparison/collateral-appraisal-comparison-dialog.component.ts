import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { StorageService } from 'app/entities/storage/storage.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import moment from 'moment';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-comparison-dialog',
  templateUrl: './collateral-appraisal-comparison-dialog.component.html',
  styleUrls: ['./collateral-appraisal-comparison.css'],
})
export class CollateralAppraisalComparisonDialogComponent implements OnInit {
  public collateral: ICollateral;
  public collateralProperty: ICollateralProperty;
  public imagePreviewSrc: string | ArrayBuffer | null | undefined = '';
  public file: File = null;
  public item: object = null;
  public collateralAppraisal: ICollateralAppraisal;

  constructor(
    private collateralService: CollateralService,
    private collateralPropertyService: CollateralPropertyService,
    private _snackBar: MatSnackBar,
    private storageService: StorageService,
    private _dialog: MatDialogRef<CollateralAppraisalComparisonDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { collateralId: string; collateralProperty: ICollateralProperty; collateralAppraisal: ICollateralAppraisal }
  ) {
    this.collateral = new Collateral();
    this.collateralAppraisal = this.data.collateralAppraisal;
    this.collateralProperty = new CollateralProperty();
    if (this.data.collateralProperty) {
      this.collateralProperty = this.data.collateralProperty;
    }
  }

  ngOnInit(): void {
    this.findCollateral();
  }

  private initObject(collateral: ICollateral): void {
    if (this.data.collateralProperty) {
      this.item = JSON.parse(this.data.collateralProperty.attributes['comparison']);

      // get the picture
      this.storageService.getBucketName().subscribe(res => {
        const bucket = res.body['bucket'];
        const obj: Object = { key: `/collateral/${this.data.collateralId}/comparison` };
        this.storageService.getObjects(bucket, obj).subscribe(res2 => {
          const files = res2.body;
          const id = this.data.collateralProperty.id;
          const file = lodash.find(files, function (o) {
            return o['tags']['collateralPropertyId'] === id.toString();
          });
          this.imagePreviewSrc = file['url'];
        });
      });
    } else {
      if (collateral.collateralTypeId === 'PROPERTY' || collateral.collateralTypeId === 'REALESTATE') {
        this.item = {
          propType: '',
          location: '',
          landArea: '',
          buildArea: '',
          offerPrice: '',
          sellPrice: '',
          source: '',
          phone: '',
          personTitle: '',
          description: '',
        };
      } else if (collateral.collateralTypeId === 'VEHICLE') {
        this.item = {
          brand: '',
          model: '',
          bidPrice: '',
          transPrice: '',
          source: '',
          phone: '',
          personTitle: '',
          description: '',
        };
      }
    }
  }

  private findCollateral() {
    this.collateralService.find(this.data.collateralId).subscribe(res => {
      this.collateral = res.body;
      this.initObject(this.collateral);
    });
  }

  private uploadFile(file: File, colPropertyId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      const metaData = {
        objectName: `collateral/${this.data.collateralId}/comparison/${currentDate}.${file.name.split('.')[1]}`,
        collateralPropertyId: colPropertyId,
      };

      this.storageService.getBucketName().subscribe(res => {
        const bucket = res.body['bucket'];
        this.storageService.uploadMeta(bucket, formData, metaData).subscribe({
          next: v => resolve(),
          error: e => reject(e),
          complete: () => console.log('complete'),
        });
      });
    });
  }

  public save(): void {
    if (this.imagePreviewSrc === '') {
      this._snackBar.open('Please select file', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    if (this.collateralProperty.id) {
      // update
      this.collateralProperty.attributes['comparison'] = JSON.stringify(this.item);
      this.collateralPropertyService.update(this.collateralProperty).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralProperty.collateralId = this.collateral.id;
      this.collateralProperty.partyId = this.collateral.partyId;
      this.collateralProperty.propertyType = CollateralPropertyType.COMPARISON;
      this.collateralProperty.attributes = {};
      this.collateralProperty.attributes['comparison'] = JSON.stringify(this.item);
      this.collateralPropertyService.create(this.collateralProperty).subscribe(res => {
        this.uploadFile(this.file, res.body.id);
        this._dialog.close(res.body);
      });
    }
  }

  private showPreview(file: any): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', event => {
      this.imagePreviewSrc = event.target?.result;
    });
  }

  public chooseFile(evt: any): void {
    this.file = evt.target.files[0];
    this.showPreview(evt.target.files?.item(0));
  }
}
