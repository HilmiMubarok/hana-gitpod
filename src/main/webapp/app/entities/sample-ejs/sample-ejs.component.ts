import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'jhi-service-sample-ejs',
  templateUrl: './sample-ejs.component.html',
})
export class SampleEjsComponent implements OnInit {
  public storageBucket: String;
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.getBucket().subscribe((res: HttpResponse<String>) => {
      this.storageBucket = res.body;
    });
  }
}
