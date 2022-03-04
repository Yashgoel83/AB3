import { Component, OnInit } from '@angular/core';
import { Amplify, Storage, API } from 'aws-amplify';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { ImagesComponentComponent } from './images-component/images-component.component';
import { VideosComponentComponent } from './videos-component/videos-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AdserviceService } from './adservice.service';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderComponent } from './loader/loader.component';


import awsexports from './../aws-exports';import { concat } from 'rxjs';
import { config } from 'process';
import { MatDialog } from '@angular/material/dialog';
[]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amplifyapp';
  assetsids:any = [];
  getfilesclicked:string
  fileuploaded = false
  workflows:string[] = []
  selectedworkflow = ''
  s3key
  jobId = ''
  jobStatus = ''
  AssetId = ''
  showprogressbar = false
  mediaType = ''

  constructor(public loader:MatDialog,public authenticator: AuthenticatorService, public router: Router, public route:ActivatedRoute, public adservice:AdserviceService) {
    Amplify.configure(awsexports);
  }

  ngOnInit()
  {
    this.selectedworkflow = ''
  this.s3key = ''
  this.jobId = ''
  this.jobStatus = ''
  this.AssetId = ''
  this.showprogressbar = false

    API.get('ControlPlaneAPI','/api/workflow',{"headers":{"Content-Type":"application/json"}}).then(workflow=>{
      if(workflow.length > 0)
      {
        workflow.map(items=>{
          this.workflows.push(items["Name"])
        })
        console.log(this.workflows)
      }
    })
    console.log(this.route)
    if(this.authenticator.route === 'authenticated')
    {
      this.router.navigate(['tables'])
    }
    else
    {
      
    }
  }

 getfiles() {

/* return Storage.list('images/',{level: 'protected', 
 identityId: 'AKIAVFBGJ4BOCF6YIH7R'}).then(items =>
    {
      console.log(items)
      return items
    }) */

this.loader.open(LoaderComponent)
this.assetsids = []
API.get('DataplaneAPI','/api/metadata/',{"headers":{"Content-Type":"application/json"}}).then(results=> 
  {
    console.log(results)
   results.assets.map(a=>
    {
      
      this.assetsids.push(a)

    })
    console.log(this.assetsids)
    this.getfilesclicked = "true"
    
    this.loader.closeAll()
    
     
   });
     
   }

  async uploadfiles(event)
  {
    this.jobId = ''
    this.jobStatus = ''
    this.selectedworkflow = ''
    this.fileuploaded = false
    let storage = Storage.configure("aws_user_files_s3_bucket")
    console.log(event.srcElement.files[0].name)
    this.s3key = "public/" + event.srcElement.files[0].name
    this.loader.open(LoaderComponent)
    let response = await Storage.put(event.srcElement.files[0].name,event.srcElement.files[0])
      
    if(response != undefined)
    {
      console.log(response.key)
      this.fileuploaded = true
      this.loader.closeAll()
    }

   

    
  }
  
  process()
  {
    console.log(this.selectedworkflow)
    let body = {}
    let Media = {}
    if(this.mediaType == "Image"){
    Media = {
      "Image": {
        "S3Bucket":awsexports.aws_user_files_s3_bucket,
        "S3Key": this.s3key
      }
    }}
    if(this.mediaType == "Video")
    {
      Media = {
        "Video": {
          "S3Bucket":awsexports.aws_user_files_s3_bucket,
          "S3Key": this.s3key
        }

    }
  }
    body = {
      "Name":this.selectedworkflow,
      "Input": {
        "Media": Media
      }
    }

    console.log(body)
    this.loader.open(LoaderComponent)
    API.post('ControlPlaneAPI','/api/workflow/execution',{"headers":{"Content-Type":"application/json"}, "body" : body}).then(response=>
      {
        console.log(response.AssetId)
        console.log(response.Id)
        this.AssetId = response.AssetId
        this.jobId = response.Id
        
        this.loader.closeAll()
      })
  }

  getjobstatus()
  {
    this.loader.open(LoaderComponent)
    API.get('ControlPlaneAPI','/api/workflow/execution/' + this.jobId,'').then(jobresponse=>
      {
        console.log(jobresponse.Status)
        this.jobStatus = jobresponse.Status
        this.loader.closeAll()
      })
  }

}
    
     
   
  


  

