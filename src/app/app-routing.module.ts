import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabItemComponent } from '@aws-amplify/ui-angular';
import { DetailsComponent } from './details/details.component';
import { ImagesComponentComponent } from './images-component/images-component.component';
import { TableComponent } from './table/table.component';
import { VideosComponentComponent } from './videos-component/videos-component.component';

const routes: Routes = [
  //{path:'', redirectTo: '/images',  pathMatch: 'full'},
  // {path:'', component: HistoryComponent,  pathMatch: 'full'},
  {path:'images', component:ImagesComponentComponent, pathMatch:'full'},
  {path:'videos', component:VideosComponentComponent,pathMatch:'full'},
  {path:'tables',component:TableComponent,pathMatch:'full'},
  {path:'details/:id',component:DetailsComponent,pathMatch:'full',runGuardsAndResolvers: 'always'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
