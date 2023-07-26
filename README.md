# Live Buddy
In this repo, I want to create an application that allows me to control [Ableton Live](https://www.ableton.com/de/live/), my favorite DAW (and the only one I know lol) in ways that are not possible out-of-the box. A big inspiration surely is [AbleSet](https://ableset.app/), which allows one to configure entire setlists in Ableton Live and manage/control it from any device on the same network as the computer running it.

I build on things I learned in [this](https://github.com/Sejmou/ableton-controls) rather hacky project I did earlier. Unfortunately, it was quite buggy and a pain to program due to the very weird approach I chose for programming it. I want to do it better this time.

## Feature Wishlist
There's several things I want to implement. I have put them into several categories:

 -  **Copycat**: These are core setlist management features already available in AbleSet. I want to build them myself too to
    - learn how to implement it myself and 
    - build on them for custom features I want to have.
 - **Sound Manager**: Configure a specific set of sounds you want to use for every song in the playlist. You can switch to them on the fly why playing. Useful e.g. for guitarists who like to use plugins like Neural DSP instead of physical amps.
 - **Practice Mode**: A dedicated mode for practicing songs on your setlist on your instrument. You can play along to other existing tracks, loop sections you struggle with, record yourself playing to track your progress etc.
 - **MIDI support**: Control Live via MIDI in ways that is not possible from Ableton Live (i.e. add MIDI mappings for all the features added by this app). For example, use a MIDI footswitch to control playback, switch between songs/sections/sounds, etc.

### Copycat
- [ ] Play/Pause/Stop
- [ ] Display current song
- [ ] Display current section of the current song
- [ ] Display how far into the song we are
- [ ] Display how far into the section we are
- [ ] Display and jump through sections of the current song

### Sound Manager
- [ ] Create a collection of sounds
- [ ] Switch between sounds
- [ ] Assign sounds to songs

### Practice Mode
- [ ] Loop sections of a song
- [ ] Change tempo
- [ ] Change key (probably **very** difficult)

### MIDI support
- [ ] Show available MIDI devices
- [ ] Select MIDI device
- [ ] Basic MIDI mappings (e.g. `note_on` on channel 1, note 1 -> `play/pause`)
- [ ] Advanced MIDI mappings (e.g. different mappings for short/long press)

## Implementation Details
The basic architecture of the project is as follows:
 - A web server acts as the 'gateway' Ableton Live via [Ableton.js](https://github.com/leolabs/ableton-js). It keeps track of all relevant state in the Live project (playback, record mode, available tracks and all their current state, etc.) and can also change it (i.e. start/stop playback). It also uses 'lower level information' from Ableton Live to _derive_ 'higher level information' required by the application. For example, low-level information like the position of locators in the project and information about the current playback time of the Live Set can be combined to figure out what song is currently playing and what is the current song section. Clients can connect to the server via WebSockets.
 - Clients use the WebSocket connection to the server to
   - receive state updates and
   - trigger actions (like starting/stopping playback, going to the next song, etc.)
  Any device with WebSocket support can be a client. This includes
   - Desktop computers
   - Mobile devices
  By far the easiest way to 'write' a client is to use a web browser. Hence, this is what I aim to do also.

In my implementation, both the server and client use TypeScript. The server will be written in Node.js. Currently, I aim to only use one type of client, a SvelteKit app. I decided to use socket.io for managing the WebSocket connection, as it seems to be a pretty popular and easy-to-use library. I set this project up as a monorepo using [pnpm](https://pnpm.io/), as I want to share code between the server and the client, specifically the WebSocket API types.

## Developer Notes
### TODOs
Here I break down the different features I want to implement into smaller, concrete programming tasks.

- [x] Setup server and client webapp with PNPM workspaces (no communication between them yet)
- [x] Setup basic socket.io connection between server and webapp (no proper API yet)
- [ ] Setup socket communication between server and client using shared API types
- [ ] Configure Ableton.js on server, control play/pause from webapp via socket connection to server
- [ ] Add Tailwind to Svelte App ([this](https://github.com/svelte-add/tailwindcss) way?)

### Known bugs

#### Low priority
 - [ ] When saving changes to the `socket.ts` file in the webapp (which triggers hot reload), for some reason previous socket connections aren't closed. The app only receives messages emitted by the server once (which is good). However, the previous connections don't disconnect, hence the server emits events to them as well. A full browser refresh immediately solves the issue though.

### Running the project in development mode
Client webapp:
```bash
pnpm run --filter webapp dev
```

Server:
```bash
pnpm run --filter server dev
```

### Building the project
TODO: Add notes on how to build the project
