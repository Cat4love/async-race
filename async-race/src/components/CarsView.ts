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

  private race!: HTMLButtonElement;

  private raceMode!: boolean;

  private reset!: HTMLButtonElement;

  private car!: HTMLElement;

  private pagination!: HTMLDivElement;

  private prev!: HTMLButtonElement;

  private next!: HTMLButtonElement;

  private pageCount = 1;

  constructor(root: HTMLElement, controller: CarsController) {
    this.root = root;
    this.controller = controller;
  }

  private createCarClick = async () => {
    if (
      this.inputName instanceof HTMLInputElement &&
      this.inputColor instanceof HTMLInputElement
    ) {
      const create = await this.controller.handleCreateCar(
        this.inputName.value,
        this.inputColor.value
      );
      console.log("create:", create);
      await this.updateGarage();
    }
  };

  private updateCarClick = async () => {
    if (
      this.updateName instanceof HTMLInputElement &&
      this.updateColor instanceof HTMLInputElement &&
      this.selectCardId !== null
    ) {
      const update = await this.controller.handleUpdateCar(
        this.updateName.value,
        this.updateColor.value,
        this.selectCardId
      );
      console.log("update:", update);
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
    await this.updateGarage();
  };

  private startEngineClick = async (id: string) => {
    let target = null;
    let sibling = null;
    let result = null;

    if (id !== null) {
      const startButtons = document.querySelectorAll(".box__start");
      for (let i = 0; i < startButtons.length; i += 1) {
        if (startButtons[i].attributes[1].value === String(id)) {
          target = startButtons[i] as HTMLButtonElement;
          target.style.background = "none";
          if (target.nextSibling !== null) {
            sibling = target.nextSibling as HTMLButtonElement;
          }
        }
      }

      const start = await this.controller.handleSwitchEngine(id, "started");
      const duration = Number(start.distance) / Number(start.velocity);
      const car = document.getElementById(`car${id}`);
      const carName = car?.getAttribute("data-name");

      if (car !== null) {
        car.style.animationDuration = `${duration}ms`;
        car.style.animationName = "slidein";
        car.style.animationFillMode = "forwards";
        car.style.animationTimingFunction = "linear";
        car.style.animationPlayState = "running";
        try {
          const drive = await this.controller.handleDriveEngine(id);

          if (!drive.success) {
            car.style.animationPlayState = "paused";
            console.log(id, "сломался");
            result = Promise.reject();
          } else {
            console.log(id, "финишировал");
            result = [id, carName, duration];
          }
          if (!this.raceMode && sibling !== null) {
            sibling.style.background = "red";
            sibling.addEventListener(
              "click",
              () => {
                this.stopEngineClick(id);
              },
              { once: true }
            );
          }
        } catch (error) {
          console.log("ПОЛОМКА");
        }
        return result;
      }
    }
    return null;
  };

  private stopEngineClick = async (id: string) => {
    let target = null;
    let sibling = null;

    await this.controller.handleSwitchEngine(id, "stopped");
    if (id !== null) {
      const car = document.getElementById(`car${id}`);
      if (car !== null) {
        car.style.animationPlayState = "paused";
        car.style.animationName = "";
      }

      const stopButtons = document.querySelectorAll(".box__stop");
      for (let i = 0; i < stopButtons.length; i += 1) {
        if (stopButtons[i].attributes[1].value === String(id)) {
          target = stopButtons[i] as HTMLButtonElement;
          target.style.background = "none";
          if (target.previousSibling !== null) {
            sibling = target.previousSibling as HTMLButtonElement;
          }
        }
      }

      if (sibling !== null) {
        sibling.addEventListener(
          "click",
          () => {
            this.startEngineClick(id);
          },
          { once: true }
        );
        sibling.style.background = "green";
      }

      console.log("stop", id);
    }
  };

  private raceClick = async () => {
    this.raceMode = true;
    this.race.style.background = "none";
    this.prev.style.background = "none";
    this.next.style.background = "none";
    this.next.removeEventListener("click", this.nextClick);
    this.prev.removeEventListener("click", this.prevClick);
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount);
    const carId = cars.map((car) => car.id);
    const promises = carId.map(async (car) => {
      const start = await this.startEngineClick(car);
      return start;
    });
    try {
      const winner = await Promise.any(promises).then((value) => {
        return value;
      });
      if (winner !== null) {
        console.log(
          winner[1],
          "ПОБЕДИЛ",
          `${(Number(winner[2]) / 1000).toFixed(2)}s`
        );
      }
    } catch (error) {
      console.log("ПОБЕДИТЕЛЕЙ НЕТ");
    }

    await Promise.allSettled(promises).then((results) => results);
    console.log("ЗАЕЗД ОКОНЧЕН");
    this.next.addEventListener("click", this.nextClick);
    this.prev.addEventListener("click", this.prevClick);
    this.updatePuginationButtons();
    this.reset.style.background = "green";
    this.reset.addEventListener("click", this.resetClick, { once: true });
  };

  resetClick = async () => {
    this.raceMode = false;
    this.reset.style.background = "none";
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount);
    const carId = cars.map((car) => car.id);
    const promises = carId.map(async (car) => {
      const stop = await this.stopEngineClick(car);
      return stop;
    });
    await Promise.all(promises);
    this.race.style.background = "green";
    this.race.addEventListener("click", this.raceClick, { once: true });
  };

  private prevClick = () => {
    if (this.pageCount > 1) {
      this.pageCount -= 1;
    }
    this.resetClick();
    this.updateGarage();
    this.updatePuginationButtons();
  };

  private nextClick = async () => {
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount + 1);
    if (cars.length > 0) {
      this.pageCount += 1;
    }
    this.resetClick();
    this.updateGarage();
    this.updatePuginationButtons();
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

    this.race = document.createElement("button");
    this.race.className = "form__button";
    this.race.style.background = "green";
    this.race.type = "button";
    this.race.innerHTML = "RACE";
    this.race.addEventListener("click", this.raceClick, { once: true });

    this.reset = document.createElement("button");
    this.reset.className = "form__button";
    this.reset.style.background = "none";
    this.reset.type = "button";
    this.reset.innerHTML = "RESET";

    const generateCars = document.createElement("button");
    generateCars.className = "form__button";
    generateCars.type = "button";
    generateCars.innerHTML = "GENERATE";

    fieldsetCreate.append(this.inputName, this.inputColor, this.createCar);
    fieldsetUpdate.append(this.updateName, this.updateColor, this.updateCar);
    this.form.appendChild(fieldsetCreate);
    this.form.append(
      fieldsetCreate,
      fieldsetUpdate,
      this.race,
      this.reset,
      generateCars
    );
  }

  private async createGarage() {
    const allCars = await this.controller.handleGetCars();
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount);

    this.garage = document.createElement("div");
    this.garage.className = "main__garage garage";

    const garageTitle = document.createElement("p");
    garageTitle.className = "garage__title";
    garageTitle.innerHTML = `Garage: ${allCars.length}`;

    const garagePageCount = document.createElement("p");
    garagePageCount.className = "garage__count";
    garagePageCount.innerHTML = `Page: ${this.pageCount}`;

    this.garage.appendChild(garageTitle);
    this.garage.appendChild(garagePageCount);

    for (let i = 0; i < cars.length; i += 1) {
      const car = cars[i];

      const box = document.createElement("div");
      box.className = "garage__box box";

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
      this.startEngine.style.background = "green";
      this.startEngine.innerHTML = "A";
      this.startEngine.setAttribute("data-id", car.id);
      this.startEngine.addEventListener(
        "click",
        (event: Event) => {
          const target = event.target as HTMLButtonElement;
          const id = target.getAttribute("data-id");
          if (id !== null && this.raceMode === false) {
            this.startEngineClick(id);
          }
        },
        { once: true }
      );

      this.stopEngine = document.createElement("button");
      this.stopEngine.className = "box__stop";
      this.stopEngine.style.background = "none";
      this.stopEngine.innerHTML = "B";
      this.stopEngine.setAttribute("data-id", car.id);

      const boxName = document.createElement("p");
      boxName.className = "box__name";
      boxName.innerHTML = car.name;

      this.car = document.createElement("div");
      this.car.id = `car${car.id}`;
      this.car.setAttribute("data-name", car.name);
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

  private async createPuginationButtons() {
    this.pagination = document.createElement("div");
    this.pagination.className = "pagination";
    this.prev = document.createElement("button");
    this.prev.className = "pagination__prev";
    this.prev.innerHTML = "PREV";
    if (this.pageCount > 1) {
      this.prev.style.background = "green";
      this.prev.addEventListener("click", this.prevClick);
    } else {
      this.prev.style.background = "none";
      this.prev.removeEventListener("click", this.prevClick);
    }
    this.next = document.createElement("button");
    this.next.className = "pagination__next";
    this.next.innerHTML = "NEXT";
    const cars = await this.controller.handleGetCarsOnPage(this.pageCount + 1);
    if (cars.length > 0) {
      this.next.style.background = "green";
      this.next.addEventListener("click", this.nextClick);
    } else {
      this.next.style.background = "none";
      this.next.removeEventListener("click", this.nextClick);
    }
    this.pagination.append(this.prev, this.next);
  }

  private async updatePuginationButtons() {
    this.main.removeChild(this.pagination);
    await this.createPuginationButtons();
    this.main.appendChild(this.pagination);
  }

  public async updateGarage() {
    this.main.removeChild(this.garage);
    await this.createGarage();
    this.main.insertBefore(this.garage, this.pagination);
  }

  public async mount() {
    this.raceMode = false;
    this.createForm();
    await this.createGarage();
    this.createPuginationButtons();
    this.main = document.createElement("main");
    this.main.appendChild(this.form);
    this.main.appendChild(this.garage);
    this.main.appendChild(this.pagination);
    this.root.appendChild(this.main);
  }
}
