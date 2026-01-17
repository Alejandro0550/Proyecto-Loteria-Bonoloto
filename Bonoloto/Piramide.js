const piramides = [];
let patrones = [];

// Cargar los datos de patrones.json
async function cargarPatronesDesdeJSON() {
    try {
        const response = await fetch("patrones.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo patrones.json");
        }
        patrones = await response.json();
    } catch (error) {
        console.error("Error al cargar los patrones:", error);
    }
}

// Guardar los datos en patrones.json
function guardarPatronesEnJSON() {
    const blob = new Blob([JSON.stringify(patrones, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patrones.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Guardar los datos en piramides.json
function guardarPiramidesEnJSON() {
    const blob = new Blob([JSON.stringify(piramides, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "piramides.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Función para incrementar el total en patrones.json
function incrementarTotalEnPatrones(numero) {
    const numeroFormateado = numero.toString().padStart(2, "0");
    const patron = patrones.find(p => p["Numero"] === numeroFormateado);
    if (patron) {
        patron.Total += 1;
    }
}

// Generar pirámide inversa
function generarPiramideInversa(primeraFila) {
    const numeros = primeraFila.split("-").map(num => parseInt(num, 10));
    if (!numeros.every(num => num >= 1 && num <= 49)) {
        throw new Error("Todos los números deben estar entre 01 y 49.");
    }

    const piramide = [numeros];
    while (piramide[piramide.length - 1].length > 1) {
        const filaActual = piramide[piramide.length - 1];
        const nuevaFila = [];
        for (let i = 0; i < filaActual.length - 1; i++) {
            let suma = filaActual[i] + filaActual[i + 1];
            if (suma > 49) suma -= 49;
            nuevaFila.push(suma);
        }
        piramide.push(nuevaFila);
    }

    return piramide;
}

// Renderizar pirámide inversa
function renderizarPiramideInversa(piramide, contenedor, index, resultados) {
    const piramideContainer = document.createElement("div");
    piramideContainer.classList.add("piramide");

    const titulo = document.createElement("h2");
    titulo.textContent = `Pirámide ${index + 1}`;
    piramideContainer.appendChild(titulo);

    const primeraFila = piramide[0];
    const fecha = primeraFila.slice(-3).map(num => num.toString().padStart(2, "0")).join("-");
    const fechaDiv = document.createElement("div");
    fechaDiv.classList.add("codigo");
    fechaDiv.textContent = `Fecha: ${fecha}`;
    piramideContainer.appendChild(fechaDiv);

    const coloresResultados = {};
    let colorIndex = 0;

    if (resultados && resultados.length > 0) {
        resultados.forEach(resultado => {
            coloresResultados[resultado] = `encontrado-${colorIndex % 6}`; // Asignar clase CSS
            colorIndex++;
        });
    }

    piramide.forEach((fila) => {
        const filaDiv = document.createElement("div");
        fila.forEach((numero) => {
            const span = document.createElement("span");
            span.textContent = numero.toString().padStart(2, "0");

            const numeroEnPiramide = piramide.slice(1).some(fila => // Excluir la primera fila
                fila.includes(parseInt(numero, 10))
            );

            const numeroFormateado = numero.toString().padStart(2, "0");
            if (numeroEnPiramide && resultados && coloresResultados[numeroFormateado]) {
                span.classList.add(coloresResultados[numeroFormateado]);
            }

            filaDiv.appendChild(span);
            filaDiv.appendChild(document.createTextNode(" "));
        });
        piramideContainer.appendChild(filaDiv);
    });

    if (resultados && resultados.length > 0) {
        const resultadosDiv = document.createElement("div");
        resultadosDiv.classList.add("numeros-buscados");
        resultadosDiv.textContent = "Resultados: ";
        resultados.forEach(resultado => {
            const span = document.createElement("span");
            span.textContent = resultado;

            const numeroEnPiramide = piramide.slice(1).some(fila => // Excluir la primera fila
                fila.includes(parseInt(resultado, 10))
            );

            if (numeroEnPiramide) {
                span.classList.add(coloresResultados[resultado]);
            } else {
                span.classList.remove(...span.classList); // Eliminar cualquier clase de color existente
            }

            resultadosDiv.appendChild(span);
        });
        piramideContainer.appendChild(resultadosDiv);
    }

    contenedor.appendChild(piramideContainer);
}

// Renderizar todas las pirámides
function renderizarTodasLasPiramides() {
    const contenedorPiramides = document.querySelector(".contenedor-piramides");
    contenedorPiramides.innerHTML = "";

    piramides.forEach((piramide, index) => {
        const filas = piramide.filas.map(fila => fila.split(", ").map(num => parseInt(num, 10)));
        renderizarPiramideInversa(filas, contenedorPiramides, index, piramide.resultado);
    });
}

// Validar la primera fila de la pirámide
function validarPrimeraFila(primeraFila) {
    const numeros = primeraFila.split("-");
    if (numeros.length < 2) {
        throw new Error("La primera fila debe contener al menos dos números.");
    }
    if (!numeros.every(num => /^\d{2}$/.test(num) && parseInt(num, 10) >= 1 && parseInt(num, 10) <= 49)) {
        throw new Error("Todos los números deben estar en el rango 01-49 y tener dos dígitos.");
    }
}

// Evento para agregar nueva pirámide
document.getElementById("formulario-piramide").addEventListener("submit", function (event) {
    event.preventDefault();

    const numeroBase = document.getElementById("numeroBase").value.trim();
    const resultados = document.getElementById("numeros").value.trim();

    try {
        validarPrimeraFila(numeroBase);
        const piramide = generarPiramideInversa(numeroBase);

        const nuevaPiramide = {
            numero_base: numeroBase,
            filas: piramide.map(fila => fila.map(num => num.toString().padStart(2, "0")).join(", ")),
            resultado: resultados ? resultados.split("-").map(num => num.trim().padStart(2, "0")) : []
        };

        piramides.push(nuevaPiramide);
        document.getElementById("mensaje-form").textContent = "Pirámide generada correctamente.";
        actualizarSelectPiramides();
        renderizarTodasLasPiramides();
    } catch (error) {
        document.getElementById("mensaje-form").textContent = error.message;
    }
});

// Evento para añadir resultados a pirámide existente
document.getElementById("formulario-resultado-existente").addEventListener("submit", function (event) {
    event.preventDefault();

    const selectPiramide = document.getElementById("select-piramide");
    const resultado = document.getElementById("resultado-existente").value.trim();

    if (!resultado) {
        document.getElementById("mensaje-resultado").textContent = "Debes ingresar un resultado.";
        return;
    }

    const piramideIndex = selectPiramide.value;
    if (piramideIndex === "nueva") {
        const nuevaPiramide = {
            numero_base: resultado,
            filas: [],
            resultado: resultado.split("-").map(num => num.trim().padStart(2, "0"))
        };

        piramides.push(nuevaPiramide);
        document.getElementById("mensaje-resultado").textContent = "Resultado añadido como nueva pirámide.";
    } else {
        const piramide = piramides[piramideIndex];
        if (!piramide.resultado) {
            piramide.resultado = [];
        }

        resultado.split("-").forEach(res => {
            const numFormateado = res.trim().padStart(2, "0");
            if (!piramide.resultado.includes(numFormateado)) {
                piramide.resultado.push(numFormateado);

                const numeroEnPiramide = piramide.filas.some(fila =>
                    fila.split(", ").map(num => num.trim()).includes(numFormateado)
                );

                if (numeroEnPiramide) {
                    incrementarTotalEnPatrones(numFormateado);
                }
            }
        });

        document.getElementById("mensaje-resultado").textContent = "Resultado añadido a la pirámide existente.";
    }


    actualizarSelectPiramides();
    renderizarTodasLasPiramides();
});

// Actualizar el select de pirámides
function actualizarSelectPiramides() {
    const selectPiramide = document.getElementById("select-piramide");
    selectPiramide.innerHTML = '<option value="nueva">Nueva pirámide</option>';
    piramides.forEach((piramide, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `Pirámide ${index + 1} - ${piramide.numero_base}`;
        selectPiramide.appendChild(option);
    });
}

// Cargar las pirámides desde el archivo JSON
async function cargarPiramidesDesdeJSON() {
    try {
        const response = await fetch("piramides.json");
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo piramides.json");
        }
        const data = await response.json();

        piramides.push(...data);
        renderizarTodasLasPiramides();
        actualizarSelectPiramides();
    } catch (error) {
        console.error("Error al cargar las pirámides:", error);
    }
}

// Cargar los datos al iniciar la aplicación
cargarPiramidesDesdeJSON();
cargarPatronesDesdeJSON();