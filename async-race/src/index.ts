import { View } from "./components/view";
import { Controller } from "./components/сontroller";
import { Model } from "./components/model";

const model = new Model();
const controller = new Controller(model);
const view = new View(
  document.querySelector("body") as HTMLElement,
  controller
);

view.mount();
