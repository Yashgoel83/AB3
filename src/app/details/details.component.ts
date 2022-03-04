import { Component, OnInit, Input, Output, EventEmitter,OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Route, NavigationEnd } from '@angular/router';
import {Amplify, API } from 'aws-amplify';
import { concat, map } from 'rxjs';
import awsexports from './../../aws-exports'
import { adddetails_temp, addetails, Mediainfo } from '../mediainfo';
import { time } from 'console';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AdserviceService } from '../adservice.service';

import {DomSanitizer} from '@angular/platform-browser';
import { url } from 'inspector';
import { async } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  navigationSubscription

  @Input()
  assetids:string

  public assetid

  public mediainfo:Mediainfo
  public product:addetails
  public product_temp:adddetails_temp

  imageurls:string[] = []

asseturl = ''

elapsedtime = 1
slotnumber = 0

videolabelslots:Array<{slotnumber:number, labels:{}}>

videol = new Map();

addurl:string = ''

found:boolean = false
deleted:boolean = false



  constructor(public dialog:MatDialog,public adservice: AdserviceService,public route:ActivatedRoute, private router:Router, public authenticator:AuthenticatorService, private sanitizer:DomSanitizer) {
    this.navigationSubscription = this.router.events.subscribe((e:any)=>
      {
        if(e instanceof NavigationEnd)
        {
          this.ngOnInit()
        }
      })
   }

  ngOnInit(): void {
    console.log("init called")
    this.getblankobject()
    this.getblankproduct();
    this.getblankproduct_temp()
    this.elapsedtime = 0
    this.slotnumber = 0
    this.videol.clear()

  
    this.assetid = this.route.snapshot.url[1].path
    this.route.snapshot.params["id"]
    this.deleted = false
    console.log(this.assetid)
    this.linkclicked_old(this.assetid)
  }

  getblankproduct_temp(){
    this.product_temp = {
      product:'',
      price:'',
      url:''
    }
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

  getblankproduct(){
    this.product = {
      product:'',
      url:'',
      price:''
    }
  }

  linkclicked_old(event)
  {
    /*console.log(event)
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
      */

      this.mediainfo.Name= this.adservice.mediobject.key
      this.asseturl = "https://d2nnj75gctg5a2.cloudfront.net/private/assets/" + event + '/' + this.adservice.mediobject.key
      if(this.adservice.mediobject.type == "Image") 
        {
          this.mediainfo.Image = true
          this.get_image_metadata(event)
        }
        if(this.adservice.mediobject.type == "Video") 
        {
          this.mediainfo.Video = true
          this.get_video_metadata(event)
        }


       
       
  }

  playing(){
    console.log("video playing")
  }

  updatetime(){
    
    console.log(this.elapsedtime*250)
    if((this.elapsedtime*250)%5000 == 0)
    {
      console.log(this.videol.get(this.slotnumber))
      console.log("call adservice")

      this.getblankproduct()
      this.get_ad(this.videol.get(this.slotnumber))
      this.slotnumber++
      
    }
    this.elapsedtime++
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
        console.log(items.cursor)
        if(items.cursor === undefined || items.cursor === null ) {
        if(items.results["Labels"].length > 0) this.set_slots_labels(items.results["Labels"]) }
        else{
          this.set_slots_labels(items.results["Labels"])
          this.get_video_metadata_iterator(this.assetid, items.cursor, items.results)
          
        }

      })
     
  }

  get_video_metadata_iterator(assetid, cursor, results:any)
  {
    // console.log(results)
      API.get('DataplaneAPI','/api/metadata/' + assetid + '/labelDetection?cursor=' + cursor,'').then(items=>{
        if(items.cursor === undefined || items.cursor === null )
        {
            this.set_slots_labels(items.results["Labels"])
            return 
        }
        else{
          this.set_slots_labels(items.results["Labels"])
          this.get_video_metadata_iterator(assetid, items.cursor, items.results)
        }
      })

  }

  set_slots_labels(labels){

    //let slotnumber = 0
    let slotnumber = Math.floor(labels[0].Timestamp/5000)
    let labels_array:any = []
    //console.log(labels)
    labels.forEach(element => {
     
      
      if(element["Label"]["Confidence"]>95)
      {

        console.log(element["Label"]["Name"])

        if(Math.floor(element.Timestamp/5000) === slotnumber)
        {
          labels_array.push(element["Label"]["Name"])
        }
        else
        {

          this.videol.set(slotnumber,labels_array)
          slotnumber++
          labels_array =[]
          labels_array.push(element["Label"]["Name"])

        }
        
        
      }
      
    });

    console.log(this.videol)

  }

 

  get_image_metadata(assetid)
  {

    API.get('DataplaneAPI','/api/metadata/'+ assetid + '/labelDetection','').then(items=>
      {
        console.log(items)
        if(items.results["Labels"].length > 0)
        {
         
        let labels:string[] = []
        items.results["Labels"].forEach(element => {
          if(element["Confidence"] > 95)
          {
            labels.push(element["Name"])
          }
          
        });

        this.get_ad(labels)          
        
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

  get_ad(product)
  {
    console.log(product)
    this.found = false;
    product.forEach(element => {

     
    
      API.get('DataplaneAPI','/api/search?q='+ element,'').then(items=>
        {
          console.log(items.hits["total"].value)
          if(items.hits["total"].value > 0 && this.product.product === '')
          {
            
            console.log(items.hits["hits"][0]["_source"].url)
            this.addurl = items.hits["hits"][0]["_source"].url
            this.product.price = items.hits["hits"][0]["_source"].price
            this.product.url = items.hits["hits"][0]["_source"].url
            this.product.product = items.hits["hits"][0]["_source"].product
            this.product_temp = this.product
            this.found = true
          }
      
        
      
      
    });
    

  

  

  })
}

  openadd()
  {
    window.open(this.product.url, "_blank")
  }

  opendialog()
  {
    this.dialog.open(DialogComponent, {data:{assetid:this.assetid}})
  }

  deleteasset()
  {
    this.deleted = false
    API.del('DataplaneAPI','/api/metadata/'+ this.assetid,'').then(response=>
      {
        this.deleted = true
      })
  }
 
  

}
