const cotizaciones = document.getElementById("cotizaciones");
const estado = document.getElementById("estado");

const tipoDolar = document.getElementById("tipo-dolar");
const direccion = document.getElementById("direccion");
const monto = document.getElementById("monto");
const btnConvertir = document.getElementById("btn-convertir");
const resultado = document.getElementById("resultado");


const API_URL = "https://dolarapi.com/v1/dolares";



let datosCotizaciones = [];


async function obtenerCotizaciones() {

    try {

        estado.innerText = "Cargando cotizaciones...";
        btnConvertir.disabled = true;

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la información.");
        }

        const datos = await respuesta.json();

        console.log(datos);

        datosCotizaciones = datos;

        
        localStorage.setItem("cotizaciones", JSON.stringify(datos));


        cotizaciones.innerHTML = "";


        datos.forEach(function(cotizacion) {

            cotizaciones.innerHTML += `
                <div class="card">
                    <h3>${cotizacion.nombre}</h3>

                    <p>
                        Compra:
                        $ ${cotizacion.compra.toLocaleString("es-AR")}
                    </p>

                    <p>
                        Venta:
                        $ ${cotizacion.venta.toLocaleString("es-AR")}
                    </p>

                    <p>
                        Actualización:
                        ${new Date(cotizacion.fechaActualizacion).toLocaleString("es-AR")}
                    </p>
                </div>
            `;

        });

        estado.innerText = "Cotizaciones actualizadas correctamente.";
        btnConvertir.disabled = false;

    } catch (error) {

        console.log(error);



        const datosGuardados = localStorage.getItem("cotizaciones");

        if (datosGuardados) {

            datosCotizaciones = JSON.parse(datosGuardados);

            cotizaciones.innerHTML = "";

            datosCotizaciones.forEach(function(cotizacion) {

                cotizaciones.innerHTML += `
                    <div class="card">
                        <h3>${cotizacion.nombre}</h3>

                        <p>Compra: $ ${cotizacion.compra}</p>

                        <p>Venta: $ ${cotizacion.venta}</p>
                    </div>
                `;

            });

            estado.innerText =
                "⚠️ Sin conexión. Mostrando la última cotización guardada.";

        } else {

            estado.innerText =
                "❌ No hay conexión y no hay datos guardados.";

        }

        btnConvertir.disabled = false;

    }

}



function convertir() {

    const montoIngresado = Number(monto.value);

    if (montoIngresado <= 0) {

        resultado.innerText = "Ingresá un monto válido.";

        return;
    }



    let cotizacionElegida;

    datosCotizaciones.forEach(function(cotizacion) {

        if (cotizacion.casa === tipoDolar.value) {

            cotizacionElegida = cotizacion;

        }

    });


    if (!cotizacionElegida) {

        resultado.innerText =
            "No se encontró esa cotización.";

        return;
    }


    // Pesos a dólares

    if (direccion.value === "pesos-dolares") {

        const dolares =
            montoIngresado / cotizacionElegida.venta;

        resultado.innerText =
            "$ " + montoIngresado +
            " = USD " + dolares.toFixed(2);

    }



    else {

        const pesos =
            montoIngresado * cotizacionElegida.venta;

        resultado.innerText =
            "USD " + montoIngresado +
            " = $ " + pesos.toFixed(2);

    }

}



btnConvertir.addEventListener("click", convertir);



obtenerCotizaciones();


