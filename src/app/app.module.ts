import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

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
import {MatDialog, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatProgressBarModule} from '@angular/material/progress-bar'
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { DialogComponent } from './dialog/dialog.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    AppComponent,
    ImagesComponentComponent,
    VideosComponentComponent,
    TableComponent,
    DetailsComponent,
    AddisplayComponent,
    SafePipe,
    DialogComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  
    AmplifyAuthenticatorModule,
  
    NoopAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  exports:[
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }