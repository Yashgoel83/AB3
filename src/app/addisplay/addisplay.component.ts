import { Component, OnInit, Input } from '@angular/core';
import { SafePipe } from '../safe.pipe';

@Component({
  selector: 'app-addisplay',
  templateUrl: './addisplay.component.html',
  styleUrls: ['./addisplay.component.css']
})
export class AddisplayComponent implements OnInit {

  @Input()
  adurl:string

  constructor() { }

  ngOnInit(): void {
  }

}
