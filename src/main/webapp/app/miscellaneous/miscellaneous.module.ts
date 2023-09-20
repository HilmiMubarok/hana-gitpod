import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DownloadProgressComponent } from './download-progress.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [MatProgressSpinnerModule, MatSnackBarModule],
  declarations: [DownloadProgressComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwMiscellaneousModule {}
