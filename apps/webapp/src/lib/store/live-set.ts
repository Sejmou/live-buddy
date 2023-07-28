import { readable, type Readable } from 'svelte/store';
import type { LiveSetState } from 'api';
import { liveSetStateProps } from 'api';
import type { Socket } from 'socket.io-client';
import { socket } from '$lib/api';

const createReadableStoreFromSocketMessage = <T>(socket: Socket | null, messageName: string) => {
	return readable<T>(undefined, (set) => {
		socket?.on(messageName, (value: T) => {
			set(value);
		});
	});
};

type LiveSetStores = {
	[K in keyof LiveSetState]: Readable<LiveSetState[K]>;
};

const createStoresForLiveState = (socket: Socket | null) => {
	const stores = {} as LiveSetStores;
	for (const stateProp of liveSetStateProps) {
		stores[stateProp] = createReadableStoreFromSocketMessage(socket, stateProp);
	}
	return stores;
};

const stores = createStoresForLiveState(socket);

export const isPlaying = stores.isPlaying;
