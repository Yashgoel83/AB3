import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { API } from 'aws-amplify';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdserviceService } from '../adservice.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  labels = [{}]

  constructor(@Inject(MAT_DIALOG_DATA) public data: {assetid: string}, public adservice:AdserviceService) { }

  ngOnInit(): void {
    console.log(this.data.assetid)
    this.labels = [{}]
    
    if(this.adservice.mediobject.type == "Image") {
    API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/labelDetection','').then(items=>
      {

        console.log(items)
        if(items.results["Labels"].length > 0)
        {
               
        items.results["Labels"].forEach(element => {
          if(element["Confidence"] > 95)
          {
           this.labels.push({"Name":element["Name"], "Confidence":element["Confidence"]})
          }
          
        });

                  
        
        }
      
      console.log(this.labels)

      })
  }

  if(this.adservice.mediobject){

    API.get('DataplaneAPI','/api/metadata/' + this.data.assetid + '/labelDetection','').then(items=>
      {
        
        if(items.results["Labels"].length > 0){
          items.results["Labels"].forEach(element => {

            if(element["Label"]["Confidence"] > 95 )
            {
              this.labels.push({"Name":element["Label"]["Name"], "Confidence":element["Label"]["Confidence"], "TimeStamp":element.Timestamp})
            }


            
          });
        }

      })
  }
}

}
