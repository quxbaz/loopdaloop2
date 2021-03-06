// Declarations
import 'routes/imports';

// CSS stuff
import {computeStyles} from 'globals/style-constants';

// Audio stuff
import sampleList from 'audio/samplelist';
import {loadAudioSamples} from 'audio/audiohelper';
import audioContext from 'globals/audiocontext';
import audioService from 'globals/audioservice';

// Sequencer
import {Sequencer, Channel} from 'sequencer';
import {sequencerDefaults, blipDefaults} from 'sequencer/lib/defaults';

// Router
import {router} from 'globals/router';

// Misc
import SequencerHelper from 'helpers/sequencer';

// Declare globals
window.$app = document.getElementById('app-container');

// Set sequencer defaults
let beatDuration = 100;
sequencerDefaults.playing = true;
blipDefaults.minOffset = 0;
blipDefaults.maxOffset = beatDuration;

/*
  <Warning> Dirty pattern going on here. We're modifying the internals
  of an library. It alters Channel to allow blips to play when @solo
  is true.
*/
Channel.prototype.playBeat = function(beat) {
  if (this.state.solo || !this.state.mute)
    this.state.blips[beat].play();
}

export default class App {

  constructor() {
    window.app = this;  // Set app to global property
    this.sequencer = new Sequencer({beatDuration});
    this.sequencer.on('playBlip', (blipState, channel) => {
      if (SequencerHelper.soloMode(this.sequencer)) {
        if (channel.state.solo)
          audioService.playBlip(blipState);
      } else
        audioService.playBlip(blipState);
    });
  }

  init() {
    return Promise.all([
      loadAudioSamples(audioContext, sampleList).then((sampleMap) => {
        audioService.sampleMap = sampleMap;
      })
    ]).then(computeStyles);
  }

  start() {
    router.start();
  }

}
