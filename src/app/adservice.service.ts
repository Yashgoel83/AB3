import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';
import { Mediainfo, mediaobject } from './mediainfo';

@Injectable({
  providedIn: 'root'
})
export class AdserviceService {

  public mediobject:mediaobject

  query = ''

  constructor() { }




 async getads(query) {

  API.get('DataplaneAPI','/api/search?q='+ query,'').then(items=>
    {

      
 }
  )
   
 }

setmediaobject(object){

  this.mediobject.assetid = object["assetID"]
  this.mediobject.key = object["key"]
  this.mediobject.type = object["MediaType"]

}

empty_mediaobject()
{ 
  this.mediobject = {

  assetid:'',
  key: '',
  type:''

}

}

}
