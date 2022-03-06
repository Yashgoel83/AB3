import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { API } from 'aws-amplify';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdserviceService } from '../adservice.service';
import { LoaderComponent } from '../loader/loader.component';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  labels = [{}]
  error = ''

  constructor(@Inject(MAT_DIALOG_DATA) public data: {assetid: string, action:string}, public adservice:AdserviceService, public settings:SettingsService) { }

  ngOnInit(): void {
    console.log(this.data.assetid)
    this.labels = [{}]
    this.error = ''
    
    if(this.adservice.mediobject.type == "Image") {

    if(this.data.action === "label") {
   
      API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/labelDetection','').then(items=>
      {

        console.log(items)
        if(items.results["Labels"].length > 0)
        {
               
        items.results["Labels"].forEach(element => {
          if(element["Confidence"] > this.settings.threshold)
          {
           this.labels.push({"Name":element["Name"], "Confidence":element["Confidence"]})
          }
          
        });

        if(this.labels.length === 0) this.error = "No Label with Confidence > 95"

                  
        
        }
        else{
          
          this.error = "No Labels Found "
        }
      
      console.log(this.labels)

      })
  }

  if(this.data.action === "celeb")
  {
    API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/celebrityRecognition','').then(items=>
      {
        if(items.results["CelebrityFaces"].length > 0)
        {
          items.results["CelebrityFaces"].forEach(element => {

            if(element["MatchConfidence"] > this.settings.threshold) {
              this.labels.push({"Name": element["Name"], "Confidence" : element["MatchConfidence"]})
            }
            
          });
          if(this.labels.length === 0 ) this.error = "No Celeb found with confidenc > 95"
        }
        else
        {
          this.error = "No Celeb Found"
        }
      })
  }

  if(this.data.action === "text")
  {
    
    API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/textDetection','').then(items=>
      {
        if(items.results["TextDetections"].length > 0)
        {
          items.results["TextDetections"].forEach(element => {

            if(element["Confidence"] > this.settings.threshold) {
              this.labels.push({"Name": element["DetectedText"], "Confidence" : element["Confidence"]})
            }
            
          });
          console.log(this.labels)
          if(this.labels.length == 0) { this.error = "No Text Detected with Confidence > 95"
          console.log("No Text") }
        }

        else {this.error = "No Text Found"}
      })

  }
}

  if(this.adservice.mediobject.type === "Video"){

    if(this.data.action === "label") {

    API.get('DataplaneAPI','/api/metadata/' + this.data.assetid + '/labelDetection','').then(items=>
      {
        
        if(items.results["Labels"].length > 0){
          items.results["Labels"].forEach(element => {

            if(element["Label"]["Confidence"] > this.settings.threshold )
            {
              this.labels.push({"Name":element["Label"]["Name"], "Confidence":element["Label"]["Confidence"], "TimeStamp":element.Timestamp})
            }


            
          });
          if(this.labels.length === 0) this.error = "No Label found with confidence > 95"
        }
        else {this.error = "No Labels Found"}

      })
    }

    if(this.data.action === "celeb")
  {
    API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/celebrityRecognition','').then(items=>
      {
        if(items.results["Celebrities"].length > 0)
        {
          items.results["Celebrities"].forEach(element => {

            if(element["Celebrity"]["Confidence"] > this.settings.threshold) {
              this.labels.push({"Name": element["Celebrity"]["Name"], "Confidence" : element["Celebrity"]["Confidence"],"TimeStamp" : element["Timestamp"]})
            }
            
          });

          if(this.labels.length === 0) this.error = "No celeb found with confidence > 95"
        }
        else {this.error = "No Celeb Found"}
      })
  }

  if(this.data.action === "text")
  {
    
    API.get('DataplaneAPI','/api/metadata/'+ this.data.assetid + '/textDetection','').then(items=>
      {
        if(items.results["TextDetections"].length > 0)
        {
          items.results["TextDetections"].forEach(element => {

            if(element["TextDetection"]["Confidence"] > this.settings.threshold) {
              this.labels.push({"Name": element["TextDetection"]["DetectedText"], "Confidence" : element["TextDetection"]["Confidence"], "TimeStamp" : element["Timestamp"]})
            }
            
          });
          console.log(this.labels)
          if(this.labels.length == 0) { this.error = "No Text Detected with Confidence > 95"
          console.log("No Text") }
        }

        else {this.error = "No Text Detected"}
      })

  }




    
  }
}

}
