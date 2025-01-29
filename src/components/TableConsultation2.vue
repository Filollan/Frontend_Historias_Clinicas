<template>
  <div class="container">
    <Spinner :isActive="isActive"></Spinner>
    
    <!-- Botón para agregar nueva consulta -->
   <!--  <div class="button-container">
      <Button label="Agregar historia clinica" icon="pi pi-plus" @click="abrirModalAgregarConsulta" />
    </div> -->

    <DataTable 
      :paginator="true" 
      :rows="5" 
      :emptyMessage="emptyMessage"
      class="table" 
      :value="filteredConsultations" 
      selectionMode="single"
    >
      <!-- Header de la Tabla con el Input de Búsqueda -->
      <template #header>
        <div class="header-content">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="globalFilterValue" @input="searchConsultation" placeholder="Buscar" />
          </span>
        </div>
      </template>

      <!-- Definición de Columnas -->
      <Column field="data.patient" header="Nombre del Paciente" sortable></Column>
      <Column field="date" header="Fecha de Consulta" sortable></Column>
      <Column field="data.gynecologist" header="Medico" sortable></Column>
      <Column field="data.reason_for_consultation" header="Razón de Consulta"></Column>
      <Column field="data.diagnosis" header="Diagnóstico"></Column>

      <!-- Columna de Acciones -->
      <Column header="Acciones">
        <template #body="slotProps">
          <Button icon="pi pi-eye" class="p-button-text custom-icon" @click="abrirModalVerConsulta(slotProps.data)" />
       
      <!--   <Button icon="pi pi-pencil" class="p-button-text custom-icon" @click="abrirModalModificarConsulta(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text custom-icon" @click="abrirModalEliminarConsulta(slotProps.data)" /> -->
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- Modal para ver consulta -->
  <Dialog v-model:visible="mostrarModalVerConsulta" header="Ver Consulta" :style="{width: '50vw'}" :modal="true">
    <div v-if="consultaSeleccionada?.hash === '32a58e7f323471bf07b06137177b358c004739412e0d056f8d7f89eb1ea4645f'" class="container-dialog">
      <div>
        <label>Paciente:</label>
        <div>{{ consultaSeleccionada?.data.patient || 'No disponible' }}</div>
      </div>
      
      <div>
        <label>Fecha:</label>
        <div>{{ consultaSeleccionada?.date || 'No disponible' }}</div>
      </div>
      <div>
        <label>Medico:</label>
        <div>{{ consultaSeleccionada?.data.gynecologist || 'No disponible' }}</div>
      </div>
      <div>
        <label>Razón de Consulta:</label>
        <div>{{ consultaSeleccionada?.data.reason_for_consultation || 'No disponible' }}</div>
      </div>
      <div>
        <label>Diagnóstico:</label>
        <div>{{ consultaSeleccionada?.data.diagnosis || 'No disponible' }}</div>
      </div>
    </div>
    <template #footer>
      <Button label="Verificar Integridad" icon="pi pi-check-circle" @click="verificarIntegridad(consultaSeleccionada.hash)" class="p-button-text" />
      <Button label="Imprimir PDF" icon="pi pi-file-pdf" @click="imprimirPDF" class="p-button-text" />
      <Button label="Enviar WhatsApp" icon="pi pi-whatsapp" @click="shareWhatsApp" class="p-button-text" />
      <Button label="Cerrar" icon="pi pi-times" @click="cerrarModalVerConsulta" class="p-button-text" />
    </template>
  </Dialog>

  <!-- Modal para modificar consulta -->
  <Dialog v-model:visible="mostrarModalModificarConsulta" header="Modificar Consulta" :style="{width: '50vw'}" :modal="true">
    <div class="container-dialog">
      <div>
        <label>Paciente:</label>
        <InputText v-model="consultaSeleccionada.data.patient" />
      </div>
      <div>
        <label>Fecha:</label>
        <InputText v-model="consultaSeleccionada.date" />
      </div>
      <div>
        <label>Medico:</label>
        <InputText v-model="consultaSeleccionada.data.gynecologist" />
      </div>
      <div>
        <label>Razón de Consulta:</label>
        <InputText v-model="consultaSeleccionada.data.reason_for_consultation" />
      </div>
      <div>
        <label>Diagnóstico:</label>
        <InputText v-model="consultaSeleccionada.data.diagnosis" />
      </div>
    </div>
    <template #footer>
      <Button label="Guardar Cambios" icon="pi pi-check" @click="guardarCambiosConsulta" autofocus />
      <Button label="Cancelar" icon="pi pi-times" @click="cerrarModalModificarConsulta" class="p-button-text" />
    </template>
  </Dialog>

  <!-- Modal para eliminar consulta -->
  <Dialog v-model:visible="mostrarModalEliminarConsulta" header="Eliminar Consulta" :style="{width: '450px'}" :modal="true">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>¿Está seguro de que desea eliminar esta consulta?</span>
    </div>
    <template #footer>
      <Button label="Sí" icon="pi pi-check" @click="eliminarConsulta" autofocus />
      <Button label="No" icon="pi pi-times" @click="cerrarModalEliminarConsulta" class="p-button-text" />
    </template>
  </Dialog>
  

  <!-- Modal para agregar consulta -->
  <Dialog v-model:visible="mostrarModalAgregarConsulta" header="Agregar Nueva Consulta" :style="{width: '50vw'}" :modal="true">
    <div class="container-dialog">
      <div>
        <label>Paciente:</label>
        <InputText v-model="nuevaConsulta.patient" />
      </div>
      <div>
        <label>Fecha:</label>
        <Calendar v-model="nuevaConsulta.date" dateFormat="dd/mm/yy" />
      </div>
      <div>
        <label>Medico:</label>
        <InputText v-model="nuevaConsulta.gynecologist" />
      </div>
      <div>
        <label>Razón de Consulta:</label>
        <Textarea v-model="nuevaConsulta.reason_for_consultation" rows="3" />
      </div>
      <div>
        <label>Diagnóstico:</label>
        <Textarea v-model="nuevaConsulta.diagnosis" rows="3" />
      </div>
    </div>
    <template #footer>
      <Button label="Guardar" icon="pi pi-check" @click="guardarNuevaConsulta" autofocus />
      <Button label="Cancelar" icon="pi pi-times" @click="cerrarModalAgregarConsulta" class="p-button-text" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Spinner from './Spinner.vue';
import jsPDF from 'jspdf';

import * as api from '../helpers/api.js';


const isActive = ref(false);
const globalFilterValue = ref('');
const mostrarModalVerConsulta = ref(false);
const mostrarModalModificarConsulta = ref(false);
const mostrarModalEliminarConsulta = ref(false);
const consultas = ref([]);
const filteredConsultations = ref([]);
const consultaSeleccionada = ref({});

// Cargar las consultas
// Cargar las consultas
async function loadConsultations() {
  isActive.value = true;
  try {
    const response = await api.getConsultations();
    consultas.value = response;
    
    // Filtra la consulta por el hash específico
    filteredConsultations.value = consultas.value.filter(consulta => consulta.hash === '20bf8f17de46ba31b130758793d8b871c46e629d3a658879230feeb401cd6689');
    
    console.log('Consultas filtradas por hash:', filteredConsultations.value); 

  } catch (error) {
    console.error('Error al cargar consultas:', error);
  } finally {
    isActive.value = false;
  }
}


const guardarCambiosConsulta = async () => {
  isActive.value = true;
  const consultaModificada = consultaSeleccionada.value;
  const id = consultaSeleccionada.value.data?.id || consultaSeleccionada.value.id;

if (!id) {
  console.error('No se encontró el ID de la consulta seleccionada.');
  alert('Error: No se pudo identificar la consulta a eliminar.');
  return;
}

  console.log('Consulta modificada:', consultaModificada);

  if (!id) {
    console.error('No se encontró el ID de la consulta seleccionada.');
    alert('Error: No se pudo identificar la consulta a modificar.');
    return;
  }

  try {
    await api.updateConsultation(id, consultaModificada);
    await loadConsultations();
    mostrarModalModificarConsulta.value = false;
    alert('Consulta modificada con éxito.');
  } catch (error) {
    console.error('Error al modificar la consulta:', error);
    alert('Error al modificar la consulta. Por favor, inténtalo de nuevo.');
  } finally {
    isActive.value = false;
  }
};

// Buscar en las consultas
const findConsulta = async (criterios) => {
  try {
    const response = await fetch('/api/consultas/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criterios)  // Se envían los criterios de búsqueda
    });
    
    if (response.ok) {
      const consultas = await response.json();
      console.log('Consultas encontradas:', consultas);
    } else {
      console.log('No se encontraron consultas que coincidan con los criterios');
    }
  } catch (error) {
    console.error('Error al buscar consulta:', error);
  }
};

const mostrarModalAgregarConsulta = ref(false);
const nuevaConsulta = ref({
  date: null,
  patient: '',
  gynecologist: '',
  reason_for_consultation: '',
  diagnosis: '',
});

// Buscar en las consultas
const searchConsultation = () => {
  if (!globalFilterValue.value) {
    filteredConsultations.value = consultas.value; // Si no hay filtro, mostrar todas las consultas
    return;
  }

  filteredConsultations.value = consultas.value.filter((consulta) => {
    // Asegúrate de que el objeto `consulta` y la propiedad `data.patient` existan
    return consulta?.data?.patient?.toLowerCase().includes(globalFilterValue.value.toLowerCase());
  });
};

const abrirModalAgregarConsulta = () => {
  nuevaConsulta.value = {
    patient: '',
    date: null,
    gynecologist: '',
    reason_for_consultation: '',
    diagnosis: ''
  };
  mostrarModalAgregarConsulta.value = true;
};

const cerrarModalAgregarConsulta = () => {
  mostrarModalAgregarConsulta.value = false;
};

const guardarNuevaConsulta = async () => {
  isActive.value = true;
  try {
    console.log('Datos de la nueva consulta:', nuevaConsulta.value);
    const response = await api.createConsultation(nuevaConsulta.value);
    console.log('Respuesta del servidor:', response);
    await loadConsultations();
    mostrarModalAgregarConsulta.value = false;
  } catch (error) {
    console.error('Error al crear la consulta:', error);
    if (error.response) {
      // El servidor respondió con un estado de error
      console.error('Datos del error:', error.response.data);
      console.error('Estado del error:', error.response.status);
      // Muestra el mensaje de error al usuario
      alert(`Error: ${error.response.data.error || 'No se pudo crear la consulta'}`);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      alert('Error de conexión: No se pudo contactar con el servidor');
    } else {
      // Algo sucedió al configurar la petición que provocó un error
      console.error('Error de configuración:', error.message);
      alert('Error inesperado: Por favor, intente de nuevo');
    }
  } finally {
    isActive.value = false;
  }
};

// Manejo de los modales
const abrirModalVerConsulta = (consulta) => {
  consultaSeleccionada.value = { ...consulta };
  console.log('Consulta seleccionada:', consultaSeleccionada.value); // Debugging log
  mostrarModalVerConsulta.value = true;
};

const cerrarModalVerConsulta = () => {
  mostrarModalVerConsulta.value = false;
};


// Montar las consultas al cargar el componente
onMounted(() => {
  loadConsultations();
  findConsulta();
  searchConsultation();
});


// Eliminar consulta
const eliminarConsulta = async () => {
  const consulta = consultaSeleccionada.value;
  const id = consulta.data?.id || consulta.id || consulta.diagnosisHash; // Ajusta según tu estructura

  console.log('ID de consulta a eliminar:', id);

  if (!id) {
    console.error('No se encontró el ID de la consulta seleccionada.');
    alert('Error: No se pudo identificar la consulta a eliminar.');
    return;
  }

  isActive.value = true;
  try {
    await api.deleteConsultation(id);
    await loadConsultations();
    mostrarModalEliminarConsulta.value = false;
    alert('Consulta eliminada con éxito.');
  } catch (error) {
    console.error('Error al eliminar la consulta:', error);
    alert('Error al eliminar la consulta. Por favor, inténtalo de nuevo.');
  } finally {
    isActive.value = false;
  }
};

// Verificar integridad de la consulta usando blockchain
const verificarIntegridad = async (hash) => {
  if (!hash) {
    console.error('No se pudo encontrar el hash para verificar la integridad.');
    alert('No se encontró el hash de la consulta.');
    return;
  }

  console.log('Hash de la consulta recibido:', hash); 
  try {
    const response = await api.verificarIntegridad(hash);
    alert('Resultado de la verificación de integridad: ' + response.esIntegro);
    // Manejar el resultado de la verificación aquí
  } catch (error) {
    console.error('Error al verificar la integridad:', error);
  }
};


// Funciones para imprimir PDF y enviar WhatsApp
const imprimirPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text('Consulta Médica', 105, 10, { align: 'center' });
  
  // Información del paciente
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente:', 10, 20);
  doc.setFont('helvetica', 'normal');
  doc.text(consultaSeleccionada.value.data.patient || 'No disponible', 50, 20);
  
  // Información de la consulta
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', 10, 30);
  doc.setFont('helvetica', 'normal');
  doc.text(consultaSeleccionada.value.date || 'No disponible', 50, 30);

  doc.setFont('helvetica', 'bold');
  doc.text('Médico:', 10, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(consultaSeleccionada.value.data.gynecologist || 'No disponible', 50, 40); // Ajuste aquí

  // Resto de campos
  doc.setFont('helvetica', 'bold');
  doc.text('Razón de Consulta:', 10, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(consultaSeleccionada.value.data.reason_for_consultation || 'No disponible', 50, 50);

  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico:', 10, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(consultaSeleccionada.value.data.diagnosis || 'No disponible', 50, 60);

  // Guarda el PDF
  doc.save(`${consultaSeleccionada.value.consulta || consultaSeleccionada.value.data.patient }.pdf`);
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





</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.table {
  margin-top: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-icon {
  margin: 0 5px;
}

.container-dialog {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.container-dialog > div {
  display: flex;
  flex-direction: column;
}

.container-dialog label {
  font-weight: bold;
  margin-bottom: 5px;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-container {
  margin-bottom: 20px;
}

.container-dialog .p-calendar {
  width: 100%;
}

.container-dialog .p-inputtextarea {
  width: 100%;
}
</style>