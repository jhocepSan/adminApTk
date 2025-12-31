
async function loginUser(info: any) {
  const result = await fetch('http://192.168.1.8:4005/login/iniciarSession', {
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
  const result = await fetch('http://192.168.1.8:4005/login/createUser', {
    method: 'POST',
    body: JSON.stringify({ info }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await result.json();
}

async function cargarImagen(ruta: string,id:number,tipo:string) {
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

export default { loginUser, editUsuario, cargarImagen }