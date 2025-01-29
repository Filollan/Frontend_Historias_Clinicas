import request from "./request.js";


/*
//Patients
export function getPatients(params) {
  return request({
    url: "patients",
    method: "get",
    params,
  });
}

export function createPatients(data) {
  return request({
    url: "patients",
    method: "post",
    data,
  });
}


export function searchPatient(data) {
  return request({
    url: "patients/search",
    method: "post",
    data,
  });
}

export function deletePatient(params) {
  return request({
    url: `patients/${params.id}`,
    method: "delete",
  });
}

export function updatePatient(id, data) {
  return request({
    url: `patients/${id}`,
    method: "put",
    data,
  });
}
*/
//consultation

export function createConsultation(data) {
  return request({
    url: "consultations",
    method: "post",
    data,
  });
}

const guardarNuevaConsulta = async () => {
  isActive.value = true;
  try {
    // Validación de campos requeridos
    const camposRequeridos = ['patient_id', 'date', 'patient', 'gynecologist', 'reason_for_consultation'];
    for (let campo of camposRequeridos) {
      if (!nuevaConsulta.value[campo]) {
        throw new Error(`El campo ${campo} es requerido`);
      }
    }

    // Asegurarse de que la fecha esté en el formato correcto
    if (nuevaConsulta.value.date instanceof Date) {
      nuevaConsulta.value.date = nuevaConsulta.value.date.toISOString().split('T')[0];
    }

    console.log('Datos de la nueva consulta:', nuevaConsulta.value);
    const response = await api.createConsultation(nuevaConsulta.value);
    console.log('Respuesta del servidor:', response);
    await loadConsultations();
    mostrarModalAgregarConsulta.value = false;
  } catch (error) {
    console.error('Error al crear la consulta:', error);
    alert(error.message || 'Error al crear la consulta. Por favor, verifique los datos e intente de nuevo.');
  } finally {
    isActive.value = false;
  }
};

export function getConsultations() {
  return request({
    url: "consultations",
    method: "get",
  }).then(response => {
    console.log(response); // Asegúrate de que la respuesta contiene los datos correctos
    return response;
  }).catch(error => {
    console.error("Error al obtener las consultas:", error);
  });
}
export function getConsultation() {
  return request({
    url: "consultations",
    method: "get",
  }).then(response => {
    console.log(response); // Asegúrate de que la respuesta contiene los datos correctos
    return response;
  }).catch(error => {
    console.error("Error al obtener las consultas:", error);
  });
}


const loadConsultations = async () => {
  isActive.value = true;
  try {
    console.log('Cargando consultas...');
    const response = await api.getConsultations();
    console.log('Respuesta recibida:', response);
    consultas.value = response;
    filteredConsultations.value = response;
    console.log('Consultas cargadas:', consultas.value);
  } catch (error) {
    console.error('Error al cargar consultas:', error);
  } finally {
    isActive.value = false;
  }
};

//consultation

export function searchConsultation(data) {
  return request({
    url: "consultations/search",
    method: "post",
    data,  // Enviamos los parámetros de búsqueda como parte del cuerpo de la solicitud
  });
}

// Verificar integridad de la consulta médica usando el hash

export function verificarIntegridad(hash) {
  return request({
    url: `consultations/verificar/${hash}`,
    method: "get",
  });
}