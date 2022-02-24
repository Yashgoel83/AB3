import { Component, OnInit } from '@angular/core';
import { Amplify, Storage, API } from 'aws-amplify';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { ImagesComponentComponent } from './images-component/images-component.component';
import { VideosComponentComponent } from './videos-component/videos-component.component';
import { Router, ActivatedRoute } from '@angular/router';

import awsexports from './../aws-exports';import { concat } from 'rxjs';
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

  constructor(public authenticator: AuthenticatorService, public router: Router, public route:ActivatedRoute) {
    Amplify.configure(awsexports);
  }

  ngOnInit()
  {
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
API.get('DataplaneAPI','/api/metadata/',{"headers":{"Content-Type":"application/json"}}).then(results=> 
  {
    console.log(results)
   results.assets.map(a=>
    {
      
      this.assetsids.push(a)

    })
    console.log(this.assetsids)
    this.getfilesclicked = "true"
    
     
   });
     
   }
  }
    
     
   
  


  

