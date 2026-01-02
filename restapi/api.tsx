const url = 'http://192.168.1.11:4005'

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
  console.log(info)
  const result = await fetch(`${url}/login/createUser`, {
    method: 'POST',
    body: JSON.stringify({ info }),
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

async function getClubes() {
  const result = await fetch(`${url}/club/getListaClubPuntuado`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}
async function getCinturones() {
  const result = await fetch(`${url}/config/getCinturones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function agregarLocation(info: any) {
  console.log(info)
  const result = await fetch(`${url}/config/editUbicacion`, {
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
  getDocentes, agregarDocente,
  getClubes, getCinturones,
  agregarLocation
}