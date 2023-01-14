import { CarsController } from "./CarsController";
import "../index.scss";

export class CarsView {
  controller: CarsController;

  root: HTMLElement;

  private main!: HTMLElement;

  private form!: HTMLFormElement;

  private inputName!: HTMLInputElement;

  private inputColor!: HTMLInputElement;

  private createCar!: HTMLButtonElement;

  private updateName!: HTMLInputElement;

  private updateColor!: HTMLInputElement;

  private updateCar!: HTMLButtonElement;

  private garage!: HTMLDivElement;

  private selectCar!: HTMLButtonElement;

  private selectCardId!: string | null;

  private removeCar!: HTMLButtonElement;

  private startEngine!: HTMLButtonElement;

  private stopEngine!: HTMLButtonElement;

  private car!: HTMLElement;

  constructor(root: HTMLElement, controller: CarsController) {
    this.root = root;
    this.controller = controller;
    this.createForm();
  }

  private createCarClick = async () => {
    if (
      this.inputName instanceof HTMLInputElement &&
      this.inputColor instanceof HTMLInputElement
    ) {
      await this.controller.handleCreateCar(
        this.inputName.value,
        this.inputColor.value
      );
      await this.updateGarage();
    }
  };

  private updateCarClick = async () => {
    if (
      this.updateName instanceof HTMLInputElement &&
      this.updateColor instanceof HTMLInputElement &&
      this.selectCardId !== null
    ) {
      await this.controller.handleUpdateCar(
        this.updateName.value,
        this.updateColor.value,
        this.selectCardId
      );
      await this.updateGarage();
    }
  };

  private selectCarClick = (event: Event) => {
    const target = event.target as HTMLButtonElement;
    this.selectCardId = target.getAttribute("data-id");
    const color = target.getAttribute("data-color");
    const name = target.getAttribute("data-name");
    if (color !== null && name !== null) {
      this.updateName.value = name;
      this.updateColor.value = color;
    }
  };

  private removeCarClick = async (event: Event) => {
    const target = event.target as HTMLButtonElement;
    const id = target.getAttribute("data-id");
    if (id !== null) {
      await this.controller.handleRemoveCar(id);
    }
    this.selectCardId = target.getAttribute("data-id");
    await this.updateGarage();
  };

  private createForm() {
    this.form = document.createElement("form");
    this.form.className = "main__form form";

    const fieldsetCreate = document.createElement("fieldset");
    fieldsetCreate.className = "form__fieldset fieldset";

    this.inputName = document.createElement("input");
    this.inputName.className = "fieldset__input_text";
    this.inputName.type = "text";

    this.inputColor = document.createElement("input");
    this.inputColor.className = "fieldset__input_color";
    this.inputColor.type = "color";

    this.createCar = document.createElement("button");
    this.createCar.className = "fieldset__button";
    this.createCar.innerText = "CREATE";
    this.createCar.type = "button";
    this.createCar.addEventListener("click", this.createCarClick);

    const fieldsetUpdate = document.createElement("fieldset");
    fieldsetUpdate.className = "form__fieldset fieldset";

    this.updateName = document.createElement("input");
    this.updateName.className = "fieldset__input_text";
    this.updateName.type = "text";

    this.updateColor = document.createElement("input");
    this.updateColor.className = "fieldset__input_color";
    this.updateColor.type = "color";

    this.updateCar = document.createElement("button");
    this.updateCar.className = "fieldset__button";
    this.updateCar.innerHTML = "UPDATE";
    this.updateCar.type = "button";
    this.updateCar.addEventListener("click", this.updateCarClick);

    const race = document.createElement("button");
    race.className = "form__button";
    race.type = "button";
    race.innerHTML = "RACE";

    const reset = document.createElement("button");
    reset.className = "form__button";
    reset.type = "button";
    reset.innerHTML = "RESET";

    const generateCars = document.createElement("button");
    generateCars.className = "form__button";
    generateCars.type = "button";
    generateCars.innerHTML = "GENERATE";

    fieldsetCreate.append(this.inputName, this.inputColor, this.createCar);
    fieldsetUpdate.append(this.updateName, this.updateColor, this.updateCar);
    this.form.appendChild(fieldsetCreate);
    this.form.append(fieldsetCreate, fieldsetUpdate, race, reset, generateCars);
  }

  private async createGarage() {
    const cars = await this.controller.handleGetCars();

    this.garage = document.createElement("div");
    this.garage.className = "main__garage garage";

    const garageTitle = document.createElement("p");
    garageTitle.className = "garage__title";
    garageTitle.innerHTML = `Garage: ${cars.length}`;

    for (let i = 0; i < cars.length; i += 1) {
      const car = cars[i];

      const box = document.createElement("div");
      box.className = "garage__box box";

      const boxName = document.createElement("p");
      boxName.className = "box__name";
      boxName.innerHTML = car.name;

      this.selectCar = document.createElement("button");
      this.selectCar.className = "box__select";
      this.selectCar.innerHTML = "SELECT";
      this.selectCar.setAttribute("data-id", car.id);
      this.selectCar.setAttribute("data-color", car.color);
      this.selectCar.setAttribute("data-name", car.name);
      this.selectCar.addEventListener("click", this.selectCarClick);

      this.removeCar = document.createElement("button");
      this.removeCar.className = "box__remove";
      this.removeCar.innerHTML = "REMOVE";
      this.removeCar.setAttribute("data-id", car.id);
      this.removeCar.addEventListener("click", this.removeCarClick);

      this.startEngine = document.createElement("button");
      this.startEngine.className = "box__start";
      this.startEngine.innerHTML = "A";

      this.stopEngine = document.createElement("button");
      this.stopEngine.className = "box__stop";
      this.stopEngine.innerHTML = "B";

      this.car = document.createElement("div");
      this.car.className = "box__car car";
      this.car.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zm-2.9 207c-6.6 18.6-24.4 32-45.3 32s-38.7-13.4-45.3-32c-1.8-5-2.7-10.4-2.7-16c0-26.5 21.5-48 48-48s48 21.5 48 48c0 5.6-1 11-2.7 16zM160 432c-20.9 0-38.7-13.4-45.3-32c-1.8-5-2.7-10.4-2.7-16c0-26.5 21.5-48 48-48s48 21.5 48 48c0 5.6-1 11-2.7 16c-6.6 18.6-24.4 32-45.3 32z"/></svg>`;

      this.car.style.fill = car.color;

      const road = document.createElement("div");
      road.className = "box__road";

      box.append(
        boxName,
        this.car,
        road,
        this.selectCar,
        this.removeCar,
        this.startEngine,
        this.stopEngine
      );

      this.garage.append(box);
    }
  }

  public async updateGarage() {
    this.main.removeChild(this.garage);
    await this.createGarage();
    this.main.appendChild(this.garage);
  }

  public async mount() {
    this.createForm();
    await this.createGarage();
    this.main = document.createElement("main");
    this.main.appendChild(this.form);
    this.main.appendChild(this.garage);
    this.root.appendChild(this.main);
  }
}
