//? VARIABLES Y SELECTORES
const form = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul');

//? EVENTOS
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    form.addEventListener('submit', agregarGasto)
}


//? CLASSES
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante(); // se manda a llamar cuando se usa nuevoGasto
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id)
        this.calcularRestante()
    }
}

class UI {
    insertarPresupuesto(cantidad) { //Inserta el presupuesto en el html
        //Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        //Agregandolo al html
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert')

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        //mensaje error
        divMensaje.textContent = mensaje;

        //insetar en el html
        document.querySelector('.primario').insertBefore(divMensaje, form)

        //quitar el html
        setTimeout(() => {
            divMensaje.remove()
        }, 4000);
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')

        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger')
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            form.querySelector('button[type="submit"]').disabled = true
        }
    }

    mostrarGastos(gastos) {

        this.limpiarHTML() //elimina el html previo


        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto

            //crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span> `


            //boton borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () =>{
                rembolsarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)

            //agregar al html
            gastoListado.appendChild(nuevoGasto)
        })
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
}

//Instancias
let presupuesto; //iniciamos el presupuesto y despues se le asignara su valor con la function de preguntarPresupuesto()

const ui = new UI();

//?FUNCIONES
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Ingresa tu presupuesto?');

    if (presupuestoUsuario == '' || presupuestoUsuario == null || isNaN(presupuestoUsuario) ||
        presupuestoUsuario <= 0) {
        window.location.reload()
    }
    //Presupuesto Valido
    presupuesto = new Presupuesto(presupuestoUsuario);
   

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) { //agregarGasto
    e.preventDefault()

    //leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validacion
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('La cantidad no es valida', 'error')
        return;
    }

    //generar un objeto con el gasto usando (object literal)
    const gasto = { nombre, cantidad, id: Date.now() }


    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //mensaje de success
    ui.imprimirAlerta('Gasto agregado correctamente!')

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //se reinicia el formulario
    form.reset()
}

 function rembolsarGasto(id){
    presupuesto.eliminarGasto(id)

    const { gastos, restante } = presupuesto
    ui.mostrarGastos(gastos)
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    
}