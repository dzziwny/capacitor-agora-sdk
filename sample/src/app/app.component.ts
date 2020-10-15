import { Plugins } from '@capacitor/core';
/****************************************************************
  ******                  uncomment for web                  ****
  ***************************************************************/
// import 'capacitor-agora-sdk';


/****************************************************************
  ******                    FILL APP_ID                  ********
  ***************************************************************/
const APP_ID = '';

const CHANNEL = 'test';
const TOKEN = null;

import { Component, OnInit } from '@angular/core';
const { Agora } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  inChannel = false;
  talking = false;

  ngOnInit(): void {
    Agora.initialize({
      appId: APP_ID
    });
  }

  joinChannel(): void {
    Agora
      .join({
        channel: CHANNEL,
        token: TOKEN,
        userId: 0
      })
      .then(() => {
        this.inChannel = true;
      });
  }

  leaveChannel(): void {
    Agora
      .leave()
      .then(() => {
        this.inChannel = false;
        this.talking = false;
      });
  }

  talk(): void {
    Agora
      .talk()
      .then(() => {
        this.talking = true;
      });
  }

  mute(): void {
    Agora
      .mute()
      .then(() => {
        this.talking = false;
      });
  }

}
