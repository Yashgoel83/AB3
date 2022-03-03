import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImagesComponentComponent } from './images-component/images-component.component';
import { VideosComponentComponent } from './videos-component/videos-component.component';
import { TableComponent } from './table/table.component';
import { DetailsComponent } from './details/details.component';
import {MatButtonModule} from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddisplayComponent } from './addisplay/addisplay.component';
import { SafePipe } from './safe.pipe';
import { FormsModule } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ImagesComponentComponent,
    VideosComponentComponent,
    TableComponent,
    DetailsComponent,
    AddisplayComponent,
    SafePipe,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  
    AmplifyAuthenticatorModule,
  
    NoopAnimationsModule,
    FormsModule,
    MatDialog
  ],
  exports:[
    MatButtonModule,
    FormsModule,
    MatDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }