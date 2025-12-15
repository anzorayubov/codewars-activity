import { Component, inject } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'codewars-visualisation';

  // Inject ThemeService early to ensure theme is applied on app initialization
  private themeService = inject(ThemeService);
}
