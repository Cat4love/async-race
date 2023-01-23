interface ICar {
  name: string;
  color: string;
  id: string;
}
interface IWinner {
  id: number;
  wins: number;
  time: number;
}

interface IEngine {
  velocity: string;
  distance: string;
}

interface IDriveEngine {
  success: boolean;
}

export class CarsModel {
  // constructor() {
  //   this.getCars();
  // }
  getRandomDigit(min: number, max: number) {
    const a = Math.ceil(min);
    const b = Math.floor(max);
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  getRandomCarName() {
    const names = [
      "Tesla",
      "BMW",
      "Mercedes-Benz",
      "Ford",
      "Toyota",
      "Volkswagen",
      "Reanult",
      "Nissan",
      "Mitsubishi",
      "Kia",
    ];

    const models = [
      "Model Y",
      "E39",
      "C-Class",
      "Mustang",
      "Corolla",
      "Rio",
      "Golf",
      "Duster",
      "Leaf",
      "Outlander",
    ];

    return `${names[this.getRandomDigit(0, 9)]} ${
      models[this.getRandomDigit(0, 9)]
    }`;
  }

  getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  async generateRandomCars() {
    const number = [...Array(10).keys()];
    const promises = number.map(async () => {
      const newCar = await this.createCar(
        this.getRandomCarName(),
        this.getRandomColor()
      );
      return newCar;
    });
    await Promise.all(promises);
    return promises;
  }

  async getCars(): Promise<ICar[]> {
    const response = await fetch(`http://localhost:3000/garage`);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    return data;
  }

  async getCarsOnPage(page: number): Promise<ICar[]> {
    const response = await fetch(
      `http://localhost:3000/garage?_page=${page}&_limit=7`
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    return data;
  }

  async createCar(name: string, color: string) {
    const response = await fetch("http://localhost:3000/garage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    console.log(`Машина создана ${JSON.stringify(data)}`);
    return data;
  }

  async updateCar(name: string, color: string, id: string) {
    const response = await fetch(`http://localhost:3000/garage/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, color }),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    console.log(`Машина обновленв ${JSON.stringify(data)}`);
    return data;
  }

  async removeCar(id: string) {
    const response = await fetch(`http://localhost:3000/garage/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    console.log(`Машина удалена ${JSON.stringify(data)}`);
    return data;
  }

  async switchEngine(id: string, state: string) {
    const response = await fetch(
      `http://localhost:3000/engine?id=${id}&status=${state}`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: IEngine = await response.json();
    return data;
  }

  async driveEngine(id: string) {
    const response = await fetch(
      `http://localhost:3000/engine?id=${id}&status=drive`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      if (response.status === 500) {
        const data: IDriveEngine = {
          success: false,
        };
        return data;
      }
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    } else {
      const data: IDriveEngine = await response.json();
      return data;
    }
  }

  async getWinners(): Promise<IWinner[]> {
    const response = await fetch(`http://localhost:3000/winners`);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<IWinner> = await response.json();
    return data;
  }

  async getWinnerssOnPage(
    page: number,
    sort?: string,
    order?: string
  ): Promise<IWinner[]> {
    const response = await fetch(
      `http://localhost:3000/winners?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<IWinner> = await response.json();
    return data;
  }

  async getWinner(id: string): Promise<IWinner> {
    console.log(id);
    const response = await fetch(`http://localhost:3000/winners/${id}`);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: IWinner = await response.json();
    return data;
  }

  async createWinner(id: string, wins: number, time: number) {
    const response = await fetch("http://localhost:3000/winners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, wins, time }),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<IWinner> = await response.json();
    console.log(`Победитель создан ${JSON.stringify(data)}`);
    return data;
  }

  async updateWinner(id: string, wins: number, time: number) {
    const response = await fetch(`http://localhost:3000/winners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wins, time }),
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<IWinner> = await response.json();
    console.log(`Победитель обновлен ${JSON.stringify(data)}`);
    return data;
  }

  async eraseWinner(id: string) {
    const response = await fetch(`http://localhost:3000/winners/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
  }
}
