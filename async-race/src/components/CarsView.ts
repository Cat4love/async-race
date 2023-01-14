import { CarsController } from "./CarsController";
import "../index.scss";

export class CarsView {
  controller: CarsController;

  root: HTMLElement;

  constructor(root: HTMLElement, controller: CarsController) {
    this.root = root;
    this.controller = controller;
  }
}
