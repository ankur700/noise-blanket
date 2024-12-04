import { mount } from "svelte";
import Offscreen from "./offscreen.svelte";

const offscreen = mount(Offscreen, {
  target: document.getElementById("root")!,
});

export default offscreen;