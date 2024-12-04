import '@styles/global.css';
import { mount } from 'svelte';
import Popup from './popup.svelte';

const popup = mount(Popup, {
  target: document.getElementById('root')!,
});

export default popup;
