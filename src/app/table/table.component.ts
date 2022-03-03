import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Amplify, API } from 'aws-amplify';
import { concat, map } from 'rxjs';
import awsexports from './../../aws-exports'
import { Mediainfo } from '../mediainfo';
import { time } from 'console';
import { DetailsComponent } from '../details/details.component';
import { AdserviceService } from '../adservice.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

public mediainfo:Mediainfo

public details:DetailsComponent

@Input()
Assets: Array<string>

imageurls:string[] = []

asseturl = ''

elapsedtime = 1
slotnumber = 0

videolabelslots:Array<{slotnumber:number, labels:{}}>

videol = new Map();






constructor(public route:ActivatedRoute, public router:Router, public adservice:AdserviceService) { 
  Amplify.configure(awsexports)
}

ngOnInit(): void {

  this.getblankobject()

  //console.log(this.Assets)

  this.Assets.map(items=>
    {
      //let item = "https://d2nnj75gctg5a2.cloudfront.net/" + items
      this.imageurls.push(items)
    })
  console.log(this.imageurls)
  }

  getblankobject(){
    this.mediainfo = {
      Name:'',
      Label:[],
      size:'',
      Dimension:'',
      DetectedText:[],
      Image:false,
      Video:false,
      VideoContentModeration:{},
      VideoCueDetection:{},
      VideoMediaInfo:{},
      Codec:'',
      Format:'',
      Colorrange:'',
      Duration:''



    }
    
  }

  ngOnChanges()
  {
    this.Assets.map(items=>
      {
        //let item = "https://d2nnj75gctg5a2.cloudfront.net/" + items
        this.imageurls.push(items)
      })
  }

  

  linkclicked(event)
  {
    this.adservice.empty_mediaobject()
    this.adservice.setmediaobject(event)
    this.router.navigate(['details',event["assetID"]])
    
  
  }

  linkclicked_old(event)
  {
    console.log(event)
    API.get('DataplaneAPI','/api/metadata/' + event,{"headers":{"Content-Type":"application/json"}}).then(
      results=> 
      {
        console.log(results.results["S3Bucket"])
        console.log(results.results["S3Key"])
        console.log(results.results["MediaType"])
        this.mediainfo.Name= results.results["S3Key"]

        this.asseturl = "https://d2nnj75gctg5a2.cloudfront.net/private/assets/" + event + '/' + results.results["S3Key"]

        if(results.results["MediaType"] == "Image") 
        {
          this.mediainfo.Image = true
          this.get_image_metadata(event)
        }
        if(results.results["MediaType"] == "Video") 
        {
          this.mediainfo.Video = true
          this.get_video_metadata(event)
        }

 
       
        console.log(this.mediainfo)
      }
      
      )

       
       
  }

  playing(){
    console.log("video playing")
  }

  updatetime(){
    this.elapsedtime++
    console.log(this.elapsedtime*250)
    if((this.elapsedtime*250)%5000 == 0)
    {
      console.log(this.videol.get(this.slotnumber)[0])
      console.log("call adservice")
      this.slotnumber++
      
    }
  }

  get_video_metadata(assetid)
  {
    API.get('DataplaneAPI','/api/metadata/' + assetid + '/labelDetection','').then(items=>
      {
        console.log(items.results["VideoMetadata"]["Codec"])
        this.mediainfo.Codec = items.results["VideoMetadata"]["Codec"]
        this.mediainfo.Format = items.results["VideoMetadata"]["Format"]
        this.mediainfo.Colorrange = items.results["VideoMetadata"]["ColorRange"]
        this.mediainfo.Duration = items.results["VideoMetadata"]["DurationMillis"];
        if(items.results["Labels"].length > 0) this.set_slots_labels(items.results["Labels"])

      })
     
  }

  set_slots_labels(labels){

    let slotnumber = 0
    let labels_array:any = []
    //console.log(labels)
    labels.forEach(element => {
     
      
      if(element["Label"]["Confidence"]>99)
      {

        console.log(element["Label"]["Name"])

        if(Math.floor(element.Timestamp/5000) == slotnumber)
        {
          labels_array.push(element["Label"]["Name"])
        }
        else
        {

          this.videol.set(slotnumber,labels_array)
          slotnumber++
          labels_array =[]

        }
        
        
      }
      
    });

    //console.log(this.videol)

  }

 

  get_image_metadata(assetid)
  {

    API.get('DataplaneAPI','/api/metadata/'+ assetid + '/labelDetection','').then(items=>
      {
        console.log(items)
        if(items.results["Labels"].length > 0)
        {
          if(items.results["Labels"][0]["Confidence"] > 99)
          {
              this.mediainfo.Label.push(items.results["Labels"][0]["Name"])
          }
        }
      })
      API.get('DataplaneAPI','/api/metadata/'+ assetid + '/textDetection','').then(items=>
        {
          console.log(items)
          if(items.results["TextDetections"].length > 0)
          {
            if(items.results["TextDetections"][0]["Confidence"] > 99)
            {
                this.mediainfo.DetectedText.push(items.results["TextDetections"][0]["DetectedText"])
            }
          }
        })

  }
    

}

