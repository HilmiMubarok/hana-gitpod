/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { UploaderComponent, SelectedEventArgs, FileInfo, RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { EmitType, detach, Browser, createElement, isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-service-sample-ejs',
  templateUrl: './sample-ejs.component.html',
  styleUrls: ['./sample-ejs.style.css'],
})
export class SampleEjsComponent implements OnInit {
  public storageBucket: String = 'hana';

  @ViewChild('previewupload')
  public uploadObj: UploaderComponent;

  public path: Object = {
    saveUrl: 'services/los/api/storage/hana/files',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  };

  public allowExtensions: string = '.png, .jpg, .jpeg';

  public dropElement: HTMLElement;
  public filesName: string[] = [];
  public filesDetails: FileInfo[] = [];
  public filesList: HTMLElement[] = [];
  public uploadWrapper: HTMLElement;
  public parentElement: HTMLElement;
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    // this.storageService.getBucket().subscribe((res: HttpResponse<String>) => {
    //   console.log(res)
    //   this.storageBucket = res.body;
    // });

    this.dropElement = document.getElementsByClassName('control-section')[0] as HTMLElement;
    if (Browser.isDevice) {
      document.getElementById('dropimage').style.padding = '0px 10%';
    }
    document.getElementById('browse').onclick = () => {
      document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
      return false;
    };
    document.getElementById('clearbtn').onclick = () => {
      if (!this.dropElement.querySelector('ul')) {
        return;
      }
      detach(this.dropElement.querySelector('ul'));
      this.filesList = [];
      this.filesDetails = [];
      this.filesName = [];
      if (this.dropElement.querySelector('#dropArea').classList.contains('e-spinner-pane')) {
        hideSpinner(this.dropElement.querySelector('#dropArea'));
        detach(this.dropElement.querySelector('.e-spinner-pane'));
      }
    };
    // document.getElementById('uploadbtn').onclick = () => {
    //   if (
    //     this.dropElement.querySelector('ul') &&
    //     this.filesDetails.length > 0
    //   ) {
    //     console.log(this.filesDetails);
    //     this.uploadObj.upload(this.filesDetails, true);
    //     console.log(this.uploadObj);
    //   }
    // };
  }
  public onSelect(args: SelectedEventArgs): void {
    console.log(args);
    if (!this.dropElement.querySelector('li')) {
      this.filesDetails = [];
    }
    if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.e-upload-files'))) {
      this.parentElement = createElement('ul', { className: 'e-upload-files' });
      document.getElementsByClassName('e-upload')[0].appendChild(this.parentElement);
    }
    const validFiles: FileInfo[] = this.validateFiles(args, this.filesDetails);
    if (validFiles.length === 0) {
      args.cancel = true;
      return;
    }
    for (let i: number = 0; i < validFiles.length; i++) {
      this.formSelectedData(validFiles[i], this);
    }
    this.filesDetails = this.filesDetails.concat(validFiles);
    args.cancel = true;
  }

  public validateFiles(args: any, viewedFiles: FileInfo[]): FileInfo[] {
    const modifiedFiles: FileInfo[] = [];
    const validFiles: FileInfo[] = [];
    let isModified: boolean = false;
    if (args.event.type === 'drop') {
      isModified = true;
      const allImages: string[] = ['png', 'jpg', 'jpeg'];
      const files: FileInfo[] = args.filesData;
      for (const file of files) {
        if (allImages.indexOf(file.type) !== -1) {
          modifiedFiles.push(file);
        }
      }
    }
    const files: FileInfo[] = modifiedFiles.length > 0 || isModified ? modifiedFiles : args.filesData;
    if (this.filesName.length > 0) {
      for (const file of files) {
        if (this.filesName.indexOf(file.name) === -1) {
          this.filesName.push(file.name);
          validFiles.push(file);
        }
      }
    } else {
      for (const file of files) {
        this.filesName.push(file.name);
        validFiles.push(file);
      }
    }
    return validFiles;
  }

  public formSelectedData(file: FileInfo, proxy: any): void {
    const liEle: HTMLElement = createElement('li', {
      className: 'e-upload-file-list',
      attrs: { 'data-file-name': file.name },
    });
    const imageTag: HTMLImageElement = <HTMLImageElement>createElement('IMG', {
      className: 'upload-image',
      attrs: { alt: 'Image' },
    });
    const wrapper: HTMLElement = createElement('span', { className: 'wrapper' });
    wrapper.appendChild(imageTag);
    liEle.appendChild(wrapper);
    liEle.appendChild(
      createElement('div', {
        className: 'name file-name',
        innerHTML: file.name,
        attrs: { title: file.name },
      })
    );
    liEle.appendChild(
      createElement('div', {
        className: 'file-size',
        innerHTML: proxy.uploadObj.bytesToSize(file.size),
      })
    );
    let clearbtn: HTMLElement;
    let uploadbtn: HTMLElement;
    clearbtn = createElement('span', {
      id: 'removeIcon',
      className: 'e-icons e-file-remove-btn',
      attrs: { title: 'Remove' },
    });
    EventHandler.add(clearbtn, 'click', this.removeFiles, proxy);
    liEle.setAttribute('title', 'Ready to Upload');
    uploadbtn = createElement('span', {
      className: 'e-upload-icon e-icons e-file-remove-btn',
      attrs: { title: 'Upload' },
    });
    uploadbtn.setAttribute('id', 'iconUpload');
    EventHandler.add(uploadbtn, 'click', this.uploadFile, proxy);
    let progressbarContainer: HTMLElement;
    progressbarContainer = createElement('progress', {
      className: 'progressbar',
      id: 'progressBar',
      attrs: { value: '0', max: '100' },
    });
    liEle.appendChild(clearbtn);
    liEle.appendChild(uploadbtn);
    liEle.appendChild(progressbarContainer);
    this.readURL(liEle, file);
    document.querySelector('.e-upload-files').appendChild(liEle);
    proxy.filesList.push(liEle);
  }
  public uploadFile(args: any): void {
    this.uploadObj.upload([this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)]], true);
  }
  public removeFiles(args: any): void {
    const removeFile: FileInfo = this.filesDetails[this.filesList.indexOf(args.currentTarget.parentElement)];
    const statusCode: string = removeFile.statusCode;
    if (statusCode === '2' || statusCode === '1') {
      this.uploadObj.remove(removeFile, true);
      this.uploadObj.element.value = '';
    }
    const index: number = this.filesList.indexOf(args.currentTarget.parentElement);
    this.filesList.splice(index, 1);
    this.filesDetails.splice(index, 1);
    this.filesName.splice(this.filesName.indexOf(removeFile.name), 1);
    if (statusCode !== '2') {
      detach(args.currentTarget.parentElement);
    }
  }
  public onFileUpload(args: any): void {
    const li: Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    const iconEle: HTMLElement = li.querySelector('#iconUpload') as HTMLElement;
    iconEle.style.cursor = 'not-allowed';
    iconEle.classList.add('e-uploaded');
    EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile);
    const progressValue: number = Math.round((args.e.loaded / args.e.total) * 100);
    if (!isNaN(progressValue) && li.querySelector('.progressbar')) {
      li.getElementsByTagName('progress')[0].value = progressValue;
    }
  }
  public onUploadSuccess(args: any): void {
    const spinnerElement: HTMLElement = document.getElementById('dropArea');
    const li: HTMLElement = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    if (li && !isNullOrUndefined(li.querySelector('.progressbar'))) {
      (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
    }
    if (args.operation === 'upload') {
      EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile);
      li.setAttribute('title', args.e.currentTarget.statusText);
      (li.querySelector('.file-name') as HTMLElement).style.color = 'green';
      (li.querySelector('.e-icons') as HTMLElement).onclick = () => {
        this.generateSpinner(this.dropElement.querySelector('#dropArea'));
      };
    } else {
      if (!isNullOrUndefined(li)) {
        detach(li);
      }
      if (!isNullOrUndefined(spinnerElement)) {
        hideSpinner(spinnerElement);
        detach(spinnerElement.querySelector('.e-spinner-pane'));
      }
    }
    li.querySelector('#removeIcon').removeAttribute('.e-file-remove-btn');
    li.querySelector('#removeIcon').setAttribute('class', 'e-icons e-file-delete-btn');
  }
  public generateSpinner(targetElement: HTMLElement): void {
    createSpinner({ target: targetElement, width: '25px' });
    showSpinner(targetElement);
  }
  public onUploadFailed(args: any): void {
    const li: Element = document.getElementById('dropArea').querySelector('[data-file-name="' + args.file.name + '"]');
    (li.querySelector('.file-name') as HTMLElement).style.color = 'red';
    li.setAttribute('title', args.e.currentTarget.statusText);
    if (args.operation === 'upload') {
      EventHandler.remove(li.querySelector('#iconUpload'), 'click', this.uploadFile);
      (li.querySelector('.progressbar') as HTMLElement).style.visibility = 'hidden';
    }
  }
  public readURL(li: HTMLElement, args: any): void {
    const preview: HTMLImageElement = li.querySelector('.upload-image');
    const file: File = args.rawFile;
    const reader: FileReader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        preview.src = reader.result as string;
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  public onFileRemove(args: RemovingEventArgs): void {
    args.postRawFile = false;
  }

  file2: File;
  public onUpload(): void {
    if (this.filesDetails.length > 0) {
      console.log(this.filesDetails);
      this.uploadObj.upload(this.filesDetails, true);
      console.log(this.uploadObj);
      this.file2 = this.filesDetails[0]?.rawFile as File;
      const metaData = {
        objectName: 'folder/' + this.file2.name,
      };
      const formData = new FormData();
      // formData.append('metaData', JSON.stringify(metaData));
      formData.append('file', this.file2);

      this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
        console.log(res);
      });
    }
  }

  file: File;
  onChange(file: File) {
    console.log(file);
    // if (file) {
    //   this.fileName = file.name;
    this.file = file;
    const formData = new FormData();
    formData.append('file', this.file, this.file?.name);

    this.storageService.upload('hana', formData).subscribe(res => {
      console.log(res);
    });
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);

    //   reader.onload = event => {
    //     this.imageUrl = reader.result;
    //   };
    // }
  }
}
