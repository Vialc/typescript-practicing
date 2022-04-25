(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function read() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function save(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function create(veiculo, newCar) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${veiculo.name}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.entry}</td>
          <td>
            <button class="delete" data-placa="${veiculo.placa}">X</button>
          </td>
          `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                deleteCar(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (newCar)
                save([...read(), veiculo]);
        }
        function deleteCar(placa) {
            const { entry, name } = read().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entry).getTime());
            if (!confirm(`O veículo ${name}, placa ${placa} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            save(read().filter(veiculo => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = read();
            if (patio.length) {
                patio.forEach((veiculo) => create(veiculo));
            }
        }
        return { read, create, deleteCar, save, render };
    }
    patio().render();
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        patio().create({ name, placa, entry: new Date().toISOString() }, true);
    });
})();
