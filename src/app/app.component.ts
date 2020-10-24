import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import moment from 'moment-timezone'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gradient Able 5+';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      moment.tz.setDefault("America/Sao_Paulo");

      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);
    });
  }
}
