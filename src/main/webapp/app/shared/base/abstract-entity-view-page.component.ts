import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({ template: '' })
export class AbstractEntityViewPageComponent<T> implements OnChanges {
  @Input()
  public mode: string;
  public view: boolean;

  constructor() {
    this.view = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.initialView(this.mode);
    }
    this.initialOnChange(changes);
  }

  protected initialOnChange(changes: SimpleChanges) {}

  protected initialView(mode: string) {
    if (this.mode === 'edit') {
      this.view = false;
    }
  }
}
