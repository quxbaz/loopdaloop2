import React from 'react';
import Stateful from 'stateful';
import {route} from 'globals/router';
import store from 'globals/store';
import {watch} from 'globals/watcher';
import PresetManager from 'components/preset/manager';

let manager = new Stateful({presets: []});
watch(manager);

route('/preset', {
  resource() {
    return store.all('preset').then((presets) => {
      manager.setState({presets});
      return manager;
    });
  },
  render(manager) {
    return <PresetManager manager={manager} />;
  }
});
