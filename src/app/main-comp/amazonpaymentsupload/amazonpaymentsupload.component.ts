import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-amazonpaymentsupload',
  imports: [SharedModule],
  templateUrl: './amazonpaymentsupload.component.html',
  styleUrl: './amazonpaymentsupload.component.scss'
})

export class AmazonpaymentsuploadComponent {
  uploadedFiles: Array < File > ;
  amazonUploadUrl: string = `${environment.bitrixStockUrl}`; 
  public documentList: any[] = [];
    constructor(private http: HttpClient) {

    }

    ngOnInit() {

    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
        this.documentList = element.target.files;
    }

    upload() {
        let formData = new FormData();
        for (var i = 0; i < this.uploadedFiles.length; i++) {
            formData.append("AznPaymentsUpload", this.uploadedFiles[i], this.uploadedFiles[i].name);
        }
        this.http.post(this.amazonUploadUrl +'/amazonpaymentsupload', formData)
            .subscribe((response: any) => {
                console.log('response received is ', response);
                alert(response.message);
            })
    }
}
