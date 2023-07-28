export type ClientAction =
  | 'startPlayback'
  | 'continuePlayback'
  | 'stopPlayback';

export type ClientAPI = {
  [K in ClientAction]: () => void;
};

export type ClientActionHandlers = ClientAPI;

// be sure to keep this up-to-date with the keys in LiveSetState!
// TODO: figure out if there is a smarter way to do this that would not required manual work at all
export const liveSetStateProps: Readonly<Array<keyof LiveSetState>> = [
  'isPlaying',
] as const;

export type LiveSetState = {
  isPlaying: boolean;
};

export type UpdateHandlers = {
  [K in keyof LiveSetState]: (update: LiveSetState[K]) => void;
};
