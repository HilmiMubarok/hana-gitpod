import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { BusinessActivityService } from './business-activity.service';

@Component({
  selector: 'jhi-loader-ba',
  template: `
    <div class="overlay">
      <div class="spinner"></div>
    </div>
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(128, 128, 128, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 999;
      }

      .spinner {
        border: 16px solid #f3f3f3;
        border-radius: 50%;
        border-top: 16px solid #3498db;
        width: 120px;
        height: 120px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
      }

      .text {
        margin-top: 40px;
        font-size: 40px;
        font-weight: bold;
        color: #3498db;
      }

      @-webkit-keyframes spin {
        0% {
          -webkit-transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoaderBAComponent implements OnInit {
  @Input() progress: number;

  @Input() progressSfdt: number;
  @Input() progressDocx: number;

  @Input() isUpload: boolean;

  constructor(private baService: BusinessActivityService) {}

  ngOnInit() {
    console.group('VALUES');
    this.baService.progressDocx$.subscribe(value => {
      this.progressDocx = value;
      console.log({ progressDocx: value });
    });
    this.baService.progressSfdt$.subscribe(value => {
      this.progressSfdt = value;
      console.log({ progressSfdt: value });
    });
    this.baService.isUpload$.subscribe(value => {
      this.isUpload = value;
      console.log({ isUpload: value });
    });

    console.groupEnd();
  }
}
