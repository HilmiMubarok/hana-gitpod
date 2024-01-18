import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: `jhi-scroll`,
  template: ` <button mat-mini-fab (click)="onScrollToTop()">
    <div class="scroll-icon arrow-up"></div>
  </button>`,
  styles: [
    `
      :host {
        position: fixed;
        float: right;
        cursor: pointer;
        right: 14px;
        bottom: 14px;
        z-index: 100;
        opacity: 0.75;
      }

      :host:hover {
        opacity: 1;
      }

      .scroll-icon {
        // display: flex;
        // justify-content: center;
        // align-items: center;
        display: inline-block;
        border: solid white;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        margin-bottom: -3px;
      }

      .arrow-up {
        // transform: rotate(-135deg);
        // -webkit-transform: rotate(-135deg);
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
      }

      .mat-mini-fab {
        background-color: #93c1dd;
        margin-bottom: 43px;
        margin-left: -45px;
      }
    `,
  ],
})
export class ScrollComponent {
  @Output() scrollToTop = new EventEmitter<void>();

  onScrollToTop(): void {
    this.scrollToTop.emit();
  }
}
