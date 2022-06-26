import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import SockJS from 'sockjs-client';
import Stomp, { Client, Subscription as StompSubscription, ConnectionHeaders, Message, Frame, SubscribeHeaders } from 'webstomp-client';

interface WebSocketState {
  stomp?: Client;
  frame?: Frame;
}

@Injectable({ providedIn: 'root' })
export class StompStore {
  private stateSubject: BehaviorSubject<WebSocketState> = new BehaviorSubject<WebSocketState>({});
  state$: Observable<WebSocketState> = this.stateSubject.asObservable();

  constructor(private location: Location) {}

  get client() {
    return this.stateSubject.getValue().stomp;
  }

  get isConnected() {
    return this.stateSubject.getValue().stomp?.connected;
  }

  get session() {
    return this.stateSubject.getValue().frame.headers['session'];
  }

  get userName() {
    return this.stateSubject.getValue().frame.headers['user-name'];
  }

  get server() {
    return this.stateSubject.getValue().frame.headers['server'];
  }

  connect(fn?: (stomp?: Client, frame?: Frame) => void): void {
    const state = this.stateSubject.getValue();

    if (state.stomp?.connected) {
      if (fn) {
        fn(state.stomp, state.frame);
      }
      return;
    }

    let url = '/stomp';
    url = this.location.prepareExternalUrl(url);
    const socket: WebSocket = new SockJS(url);
    socket.onclose = this.handleOnClose;

    //
    const client: Client = Stomp.over(socket, {
      protocols: ['v12.stomp'],
      debug: false,
      heartbeat: { incoming: 300000, outgoing: 300000 },
    });
    const headers: ConnectionHeaders = {};
    client.connect(headers, (frame_: Frame) => {
      this.stateSubject.next({ ...state, stomp: client, frame: frame_ });
      if (fn) {
        fn(client, frame_);
      }
    });
  }

  handleOnClose(err: any): any {
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  disconnect(): void {
    const state = this.stateSubject.getValue();
    let client = state.stomp;

    if (client) {
      if (client.connected) {
        client.disconnect();
      }
      client = null;

      // Update State
      this.stateSubject.next({ ...state, stomp: client });
    }
  }

  public send(destination: string, body: any, header?: any) {
    if (this.client?.connected) {
      this.client.send(destination, body, header);
    }
  }

  watch(destination: string, fn?: (message: Message) => any, headers?: SubscribeHeaders) {
    if (this.client?.connected) {
      return this.client.subscribe(destination, fn, headers);
    }
    return undefined;
  }

  watchUser(destination: string, fn?: (message: Message) => any, headers?: SubscribeHeaders) {
    if (this.client?.connected) {
      return this.client.subscribe(destination + '-user' + this.session, fn, headers);
    }
    return undefined;
  }

  unsubscribe(subs: StompSubscription) {
    subs?.unsubscribe();
    subs = null;
  }
}
