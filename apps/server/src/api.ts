import type {
  Socket as ClientConnection,
  Server as SocketServer,
} from 'socket.io';
import type {
  ClientAction,
  ClientActionHandlers,
  UpdateHandlers,
  LiveSetState,
} from 'api';
import { liveSetStateProps } from 'api';
import type { Ableton } from 'ableton-js';
import { Observable, Subscription } from 'rxjs';

export const setupClientActionHandlers = (
  socket: ClientConnection,
  handlers: ClientActionHandlers
) => {
  for (const actionStr in handlers) {
    const action = actionStr as ClientAction;
    socket.on(action, () => handlers[action]());
  }
};

type StateObservables = {
  [K in keyof LiveSetState]: Observable<LiveSetState[K]>;
};

export const createLiveSetStateObservables = (
  ableton: Ableton
): StateObservables => {
  return {
    isPlaying: new Observable(subscriber => {
      ableton.song.addListener('is_playing', isPlaying => {
        console.log('is_playing:', isPlaying);
        subscriber.next(isPlaying);
      });
    }),
  };
};

const createUpdateHandlers = (socket: SocketServer): UpdateHandlers => {
  const handlers = {} as UpdateHandlers;
  for (const stateProp of liveSetStateProps) {
    handlers[stateProp] = (update: LiveSetState[typeof stateProp]) => {
      console.log(`emitting ${stateProp} update:`, update);
      socket.emit(stateProp, update);
    };
  }
  return handlers;
};

// iterate over key value pairs in liveSetStateObservables and subscribe to each observable
// when the observable emits a value, emit that value to the client via the socket
export const setupUpdateHandlers = (
  socket: SocketServer,
  stateObservables: StateObservables
) => {
  const subscriptions: Subscription[] = [];
  const handlers = createUpdateHandlers(socket);

  console.log(handlers);

  for (const stateKey in stateObservables) {
    const stateObservable = stateObservables[stateKey as keyof LiveSetState];
    const subscription = stateObservable.subscribe(value => {
      handlers[stateKey as keyof LiveSetState](value);
    });
    subscriptions.push(subscription);
  }

  socket.on('disconnect', () => {
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });
};
