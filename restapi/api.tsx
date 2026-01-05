export const url = 'http://192.168.1.11:4005'

async function loginUser(info: any) {
  const result = await fetch(`${url}/login/iniciarSession`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function editUsuario(info: any) {
  const result = await fetch(`${url}/login/editarperfil`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function cargarImagen(ruta: string, id: number, tipo: string) {
  const formData = new FormData();
  formData.append('file', {
    uri: ruta,
    name: `foto.jpg.${id}.`,
    type: 'image/jpeg',
  } as any);
  const res = await fetch('TU_URL_API/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = await res.json();
}

async function getDocentes(info: any) {
  const result = await fetch(`${url}/docente/getDocentes`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function agregarDocente(info: any) {
  const result = await fetch(`${url}/docente/agregarDocente`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function editarEstadoDoc(info: any) {
  const result = await fetch(`${url}/docente/editarEstadoDoc`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function getClubes() {
  const result = await fetch(`${url}/club/getListaClubPuntuado`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}
async function getCinturones(info:any) {
  const result = await fetch(`${url}/config/getCinturones`, {
    method: 'POST',
    body:JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}
async function agregarCinturon(info:any){
  const result = await fetch(`${url}/config/addCinturonClub`, {
    method: 'POST',
    body:JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}
async function editarEstadoCinturon(info:any) {
  const result = await fetch(`${url}/config/estadoCinturonClub`, {
    method: 'POST',
    body:JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function agregarLocation(info: any) {
  const result = await fetch(`${url}/config/editUbicacion`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function getHorarios(info: any) {
  const result = await fetch(`${url}/horario/getHorarios`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function addHorarios(info: any) {
  const result = await fetch(`${url}/horario/agregarHorario`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function getEstudiantes(info:any) {
  const result = await fetch(`${url}/estudiante/getEstudiantes`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function agregarEstudiante(info:any) {
  const result = await fetch(`${url}/estudiante/addEstudiante`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function editarEstadoEstu(info:any) {
  const result = await fetch(`${url}/estudiante/editEstadoEstu`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}
async function getAsisEstudi(info:any) {
  const result = await fetch(`${url}/estudiante/getAsisEstudi`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function changeAsistencia(info:any) {
  const result = await fetch(`${url}/estudiante/setAsistencia`, {
    method: 'POST',
    body: JSON.stringify(info),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

export default {
  loginUser, editUsuario, cargarImagen,
  getDocentes, agregarDocente, editarEstadoDoc,
  getClubes, 
  getCinturones,agregarCinturon,editarEstadoCinturon,
  agregarLocation,
  getHorarios,addHorarios,
  getEstudiantes,agregarEstudiante,editarEstadoEstu,getAsisEstudi,changeAsistencia
}