import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'currency-converter';

  public constructor(private router: Router) {
  }

  public async navigateToHistory(): Promise<void> {
    await this.router.navigate(['/history']);
  }

  public async navigateToConverter(): Promise<void> {
    await this.router.navigate(['/converter']);
  }
}
