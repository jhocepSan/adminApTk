
async function loginUser (info : any) {
    var result = await fetch('http://192.168.1.8:4005/login/iniciarSession', {
       method: 'POST',
       body: JSON.stringify(info),
       headers: {
         'Content-Type': 'application/json'
       } 
    })
    return await result.json();
}

export default {loginUser}