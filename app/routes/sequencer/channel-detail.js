import React from 'react';
import {route} from 'globals/router';
import store from 'globals/store';
import SequencerComponent from 'components/sequencer/sequencer';
import ChannelDetailComponent from 'components/channel-detail/channel-detail';

route('/sequencer/channel/:id', {
  resource(id) {
    return store.get('channel', id).then((channel) => {
      return [app.sequencer, store.objectFor(channel)];
    });
  },
  render([sequencer, channel]) {
    let {currentBeat} = sequencer.state;
    return (
      <SequencerComponent sequencer={sequencer}>
        <ChannelDetailComponent channel={channel} currentBeat={currentBeat} />
      </SequencerComponent>
    );
  }
});
