interface Veiculo {
  name: string,
  placa: string,
  entry: Date | string,
}

(function () {
  const $ = (query: string): HTMLInputElement | null => 
    document.querySelector(query);

    function calcTempo(mil: number) {
      const min = Math.floor(mil/60000);
      const sec = Math.floor((mil % 60000) / 1000);

      return `${min}m e ${sec}s`;
    }

    function patio() {
      function read(): Veiculo[] {
        return localStorage.patio ? JSON.parse(localStorage.patio) : [];
      }

      function save(veiculos: Veiculo[]) {
        localStorage.setItem("patio", JSON.stringify(veiculos))
      }

      function create(veiculo: Veiculo, newCar?: boolean) {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${veiculo.name}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.entry}</td>
          <td>
            <button class="delete" data-placa="${veiculo.placa}">X</button>
          </td>
          `;

          row.querySelector(".delete")?.addEventListener("click", function(){
            deleteCar(this.dataset.placa)
          })

          $("#patio")?.appendChild(row);

         if (newCar) save([...read(), veiculo]);
      }

      function deleteCar(placa: string) {
        const { entry, name } = read().find(veiculo => veiculo.placa === placa);

        const tempo = calcTempo(new Date().getTime() - new Date(entry).getTime());

        if(!confirm(`O veículo ${name}, placa ${placa} permaneceu por ${tempo}. Deseja encerrar?`)) return;

        save(read().filter(veiculo => veiculo.placa !== placa));
        render();
      }


      function render() {
        $("#patio")!.innerHTML = "";
        const patio = read();

        if (patio.length) {
          patio.forEach((veiculo) => create(veiculo));
        }
      }

      return { read, create, deleteCar, save, render }
    }
  
  patio().render();

  $('#cadastrar')?.addEventListener("click", () => {
    const name = $('#nome')?.value;
    const placa = $('#placa')?.value;

    if(!name || !placa) {
      alert("Os campos nome e placa são obrigatórios");
      return;
    }

    patio().create({ name, placa, entry: new Date().toISOString() }, true)
  });
}) ();