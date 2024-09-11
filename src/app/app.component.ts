import { Component } from '@angular/core';
import { ElementTableComponent } from './element-table/element-table/element-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ElementTableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title ="Atipera"
}
