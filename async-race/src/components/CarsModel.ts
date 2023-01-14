interface ICar {
  name: string;
  color: string;
  id: string;
}

export class CarsModel {
  constructor() {
    this.getCars();
  }

  async getCars(): Promise<ICar[]> {
    const response = await fetch("http://localhost:3000/garage");
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data: Array<ICar> = await response.json();
    console.log(data);
    return data;
  }
}
