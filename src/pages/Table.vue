<template>
 <div class="container">
    <Spinner :isActive="isActive"></Spinner>
    <DataTable 
      :paginator="true" 
      :rows="5" 
      :emptyMessage="emptyMessage"
      class="table" 
      :value="filterdPacientes" 
      selectionMode="single"
    >
      <!-- Header de la Tabla con el Input de Búsqueda y el Botón Agregar -->
      <template #header>
        <div class="header-content">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="globalFilterValue" @input="buscarTodo" placeholder="Buscar" />
          </span>
          <Button class="btn-success-custom" @click="abrirDialogAgregarPaciente">
            Agregar Paciente
          </Button>
        </div>
      </template>

      <!-- Definición de Columnas -->
      <Column field="name" header="Nombre" sortable ></Column>
      <Column field="last_name" header="Apellido" sortable></Column>
      <Column field="dni" header="DNI" sortable>
        <template #body="rowData">
          {{ rowData.data.no_of_doc ? rowData.data.no_of_doc : '-' }}
        </template>
      </Column>
      <Column field="cell_phone" header="Teléfono" sortable></Column>
      <Column field="mail" header="Email" sortable></Column>

      <!-- Columna de Acciones -->
      <Column header="Acciones">
        <template #body="rowData">
          <Button icon="pi pi-eye" class="p-button-text custom-icon" @click="abrirModalVer(rowData.data)" />
          <Button icon="pi pi-pencil" class="p-button-text custom-icon" @click="abrirModalModificar(rowData.data)" />
          <Button icon="pi pi-trash" class="p-button-text custom-icon" @click="abrirModalEliminar(rowData.data)" />
          <Button icon="pi pi-angle-double-right" class="p-button-text custom-icon" @click="abrirModalConsulta(rowData.data)" />
        </template>
      </Column>
    </DataTable>
  </div>

<!--Modal agregar paciente-->
<AgregarPaciente :visible="mostrarModalAgregar" header="Nuevo Paciente" @update:visible="cerrarDialogAgregarPaciente" />


<!-- modal agregar consulta -->
<!-- Modal agregar consulta -->
<AgregarConsulta 
  :paciente="pacienteSeleccionado" 
  header="Nueva Consulta" 
  :visible="mostrarModalConsulta" 
  @update:visible="CerrarModalAgregarConsulta" 
/>


<!-- Modal Modificar Paciente -->
<ModificarPaciente :paciente="pacienteSeleccionado" :visible="mostrarModalModificar" @update:visible="cerrarModalModificar"/>

 <!-- Modal Eliminar Paciente -->
 <Dialog v-model="mostrarModalEliminar" header="Eliminar Paciente" :visible="mostrarModalEliminar" class="p-dialog">
    <p>¿Está seguro que desea eliminar el paciente?</p>
    <div class="dialog-button">
      <Button label="Cancelar" class="p-button-redondeado" @click="cerrarModalEliminar" />
      <Button label="Eliminar" class="p-button-redondeado p-button-danger" @click="eliminarPaciente" />
    </div>
  </Dialog>
  
<!-- Modal Ver Paciente -->
<Dialog v-model="mostrarModalVer" header="Ver Paciente" :visible="mostrarModalVer" class="p-dialog" style="width: 800px;">
    <div class="container-dialog">
      <div>
        <label>Nombre:</label>
        <div>{{ pacienteSeleccionado.name }}</div>
      </div>
      <div>
        <label>Apellido:</label>
        <div>{{ pacienteSeleccionado.last_name }}</div>
      </div>
      <div>
        <label>Dirección:</label>
        <div>{{ pacienteSeleccionado.address }}</div>
      </div>
      <div>
        <label>Localidad:</label>
        <div>{{ pacienteSeleccionado.location }}</div>
      </div>
      <div>
        <label>Provincia:</label>
        <div>{{ pacienteSeleccionado.province }}</div>
      </div>
      <div>
        <label>Teléfono:</label>
        <div>{{ pacienteSeleccionado.cell_phone }}</div>
      </div>
      <div>
        <label>Mail:</label>
        <div>{{ pacienteSeleccionado.mail }}</div>
      </div>
      <div>
        <label>Fecha De Nacimiento:</label>
        <div>{{ (new Date(pacienteSeleccionado.birthdate)).toLocaleString() }}</div>
      </div>
      <div>
        <label>Edad:</label>
        <div>{{ pacienteSeleccionado.date }}</div>
      </div>
      <div>
        <label>Tipo De Sangre:</label>
        <div>{{ pacienteSeleccionado.blood_type }}</div>
      </div>
      <div>
        <label>Rh:</label>
        <div>{{ pacienteSeleccionado.rh }}</div>
      </div>
      <div>
        <label>Historia Familiar:</label>
        <div>{{ pacienteSeleccionado.family_history }}</div>
      </div>
      <div>
        <label>Historia Personal:</label>
        <div>{{ pacienteSeleccionado.personal_background }}</div>
      </div>
      <div>
        <label>Cobertura:</label>
        <div>{{ pacienteSeleccionado.coverage }}</div>
      </div>
    </div>
    <div class="dialog-button">
      <Button icon="pi pi-print" class="p-button-rounded p-button-success"
        style="color: rgb(77, 77, 240); background-color: antiquewhite;" @click="generatePDF" />
      <Button icon="pi pi-comment" class="p-button-rounded p-button-success" @click="shareWhatsApp" />
      <Button label="Cerrar" class="p-button-rounded p-button-secondary" @click="cerrarModalVer" />
    </div>
  </Dialog>

 <!-- Diálogo de Notificación -->
 <Dialog v-model:visible="mostrarDialogoNotificacion" header="Notificación" :modal="true" :closable="false">
      <p>{{ mensaje }}</p>
      <Button label="Cerrar" @click="mostrarDialogoNotificacion = false" />
    </Dialog>






</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits, watch} from 'vue';
const { rowData } = defineProps(['rowData']);
const emit = defineEmits();
const mostrarModalConsulta = ref(false);
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import * as api from '../helpers/api.js'
import TableConsultationVue from '../components/TableConsultation.vue';
import AgregarPaciente from '../components/generics/AgregarPaciente.vue';
import ModificarPaciente from '../components/generics/ModificarPaciente.vue';
import AgregarConsulta from '../components/generics/AgregarConsulta.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useRouter } from 'vue-router';
import jsPDF from 'jspdf';


const globalFilterValue = ref('')
const mostrarModalAgregar = ref(false);
const mostrarModalVer = ref(false);
const mostrarModalModificar = ref(false);
const mostrarModalEliminar = ref(false);
const mostrarModal = ref(false)
const pacientes = ref([]);
const filterdPacientes = ref([])
const mostrarDialogMensaje = ref()
const mensaje = ref()

function mostrarModalMensaje (mensaje){
  mostrarDialogMensaje.value=mensaje
  mostrarModalMensaje.vale = true
}


//cargar pacientes en la tabla
async function loadPatientes() {
  try {
    const patients = await api.getPatients()
      console.log("Pacientes cargardos:",patients)
      pacientes.value = patients
    
  } catch (error) {
    console.error("Error al cargar pacientes", error)
    
  }
}


//debe llamar a load loadPatientes para hacer el filtro de la tabla 
const buscarTodo = async () => {
  try {
    console.log("Antes de cargar la tabla");
    await loadPatientes();
    console.log("Tabla cargada");

    const searchTerm = globalFilterValue.value.trim().toLowerCase();
    console.log("Busqueda terminada:", searchTerm);

    if (searchTerm === '') {
      filterdPacientes.value = [...pacientes.value];
    } else {
      filterdPacientes.value = pacientes.value.filter(paciente => {
        for (const prop in paciente) {
          if (paciente[prop] && paciente[prop].toString().toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
        return false;
      });
    }
  } catch (error) {
    console.error("Error searching patients:", error);
  }
}


const pacienteSeleccionado = ref({
      id:'',
      name: '',
      last_name:'',
      address:'',
      location:'',
      province:'',
      cell_phone:'',
      mail:'',
      birthdate:'',
      blood_type:'',
      rh:'',
      coverage:'',
      date:'',
      cod_post:'',
      nationalid:'',
      telephone:'',
      type_of_do:'',
      no_of_doc:'',
      sex:'',
      est_civil:'',
      occupation:'',
      type_of_debt:'',
      cod_deudorcod_plan:'',
      nro_affilia:'',
      primera_vi:'',
      cuit:'',
      condition:'',
      notes:'',
});



function abrirDialogAgregarPaciente() {
  mostrarModalAgregar.value = true;
}

function cerrarDialogAgregarPaciente() {
  mostrarModalAgregar.value = false;
}



const CerrarModalAgregarConsulta =() => {
  mostrarModalConsulta.value = false;
};

//monta los pacientes en la tabla
onMounted(async () => {
  await loadPatientes();
  buscarTodo()

})

//eliminar pacientes
async function eliminarPaciente() {
  try { 
    console.log(pacienteSeleccionado.value)
    const pacienteId = pacienteSeleccionado.value.id;

    if (!pacienteId) {
      console.log("El ID del paciente seleccionado es undefined.");
      return;
    }
    mostrarModalMensaje('El id del paciente es indefinido')

    const indice = pacientes.value.findIndex(p => p.id === pacienteId);
    if (indice !== -1) {
      pacientes.value.splice(indice, 1);
    }

    const res = await api.deletePatient({ id: pacienteId })
    mostrarModalMensaje('Se eliminó correctamente el paciente')

    console.log(res.data, "res");


    cerrarModalEliminar();

    pacienteSeleccionado.value = {
      id: '',
      name: '',
      last_name:'',
      address:'',
      location:'',
      province:'',
      cell_phone:'',
      mail:'',
      birthdate:'',
      blood_type:'',
      rh:'',
      coverage:'',
      family_history:'',
      personal_background:'',
      date:'',
      cod_post:'',
      locality:'',
      nationalid:'',
      telephone:'',
      type_of_do:'',
      no_of_doc:'',
      sex:'',
      est_civil:'',
      occupation:'',
      type_of_debt:'',
      cod_deudorcod_plan:'',
      nro_affilia:'',
      gavado:'',
      primera_vi:'',
      last_vis:'',
      nro_de_vis:'',
      cod_seguim:'',
      geozona:'',
      cuit:'',
      posivapaci:'',
      condition:'',
      hcanterior:'',
      notes:'',
      nullflags:'',
   
    };
  } catch (err) {
    console.log(err, "error al eliminar");
    cerrarModalEliminar();
  }
}

//mensaje
const emptyMessage = computed(() => {
  return 'No se encontraron pacientes.';
});





//Función pdf
const generatePDF = () => {
  const doc = new jsPDF();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();

  doc.setFontSize(18);
  doc.setTextColor('#007BFF');
  doc.setFont('helvetica', 'bold');

  doc.text(`Fecha: ${formattedDate}`, 10, 30);
  doc.text(`Hora: ${formattedTime}`, 210 - doc.getTextWidth(`Hora: ${formattedTime}`) - 10, 30);
  doc.text('Historia Clínica del Paciente', 90, 45, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor('#333');
  doc.setFont('helvetica', 'normal');


  let posY = 80;
  const lineSpacing = 10;

  doc.text(`Nombre: ${pacienteSeleccionado.value.name} ${pacienteSeleccionado.value.last_name}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Dirección: ${pacienteSeleccionado.value.address}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Localidad: ${pacienteSeleccionado.value.location}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Provincia: ${pacienteSeleccionado.value.province}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Teléfono: ${pacienteSeleccionado.value.cell_phone}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Email: ${pacienteSeleccionado.value.mail}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Fecha de Nacimiento: ${pacienteSeleccionado.value.birthdate}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Tipo de Sangre: ${pacienteSeleccionado.value.blood_type}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Factor RH: ${pacienteSeleccionado.value.rh}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Cobertura Médica: ${pacienteSeleccionado.value.coverage}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Antecedentes Familiares: ${pacienteSeleccionado.value.family_history}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Antecedentes Personales: ${pacienteSeleccionado.value.personal_background}`, 20, posY);
  posY += lineSpacing;

  doc.text(`DNI: ${pacienteSeleccionado.value.dni}`, 20, posY);
  posY += lineSpacing;

  doc.text(`Fecha: ${pacienteSeleccionado.value.date}`, 20, posY);

  doc.save('historia_clinica_paciente.pdf');
};



const shareWhatsApp = () => {
  // Construye el mensaje con los datos específicos de la historia clínica
  const message = `
    Paciente: ${pacienteSeleccionado.value.name} ${pacienteSeleccionado.value.last_name}
    Fecha: ${new Date(historiaClinicaSeleccionada.value.date).toISOString()}
    Médico: ${historiaClinicaSeleccionada.value.gynecologist}
    Razón de Consulta: ${historiaClinicaSeleccionada.value.reason_for_consultation}
    Diagnóstico: ${historiaClinicaSeleccionada.value.diagnosis}
  `.trim();

  // Crea el enlace para enviar el mensaje por WhatsApp
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  // Abre el enlace en una nueva ventana
  window.open(whatsappLink, '_blank');
};





//funciones de modales

const abrirModalConsulta = (paciente) => {
  if (!paciente.id) {
    console.error("El paciente no tiene un ID válido.");
    mostrarModalMensaje('Error: El paciente seleccionado no tiene un ID válido.');
    return;
  }
  console.log("Paciente seleccionado para la consulta:", paciente.id);
  pacienteSeleccionado.value = paciente; // Almacena el paciente seleccionado
  mostrarModalConsulta.value = true; // Abre el modal de consulta
};



function abrirModalVer(pacientes) {
  pacienteSeleccionado.value =pacientes;
  mostrarModalVer.value = true;
}

function cerrarModalVer() {
  mostrarModalVer.value = false;
}


function abrirModalModificar(paciente) {
  pacienteSeleccionado.value = { ...paciente };
  mostrarModalModificar.value = true;
}

function cerrarModalModificar() {
  mostrarModalModificar.value = false;
}

function abrirModalEliminar(paciente) {
  pacienteSeleccionado.value = paciente;
  mostrarModalEliminar.value = true;
}

function cerrarModalEliminar() {
  mostrarModalEliminar.value = false;
}



</script>
<style scoped>
.btn-success-custom {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
}

.btn-success-custom:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.p-inputtext {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.dialog-button {
  margin-top: 10px;
  text-align: right;
}

.p-dialog {
  padding: 15px;
}

.dialog-button .p-button {
  margin-left: 10px;
  min-width: 120px;
}

.table {
  margin-top: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.p-datatable-thead > tr > th,
.p-datatable-tbody > tr > td {
  padding: 8px 12px;
}

.p-input-icon-left {
  margin-right: 10px;
}
</style>