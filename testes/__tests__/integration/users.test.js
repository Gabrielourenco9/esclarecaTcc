const api = require('../../services/api')

//ATUALIZAR USUÁRIO
describe('Users_Put', () =>{
    it('Atualizar usuário e retornar status 204', async () =>{
        const response = await api.put('users/5f5c15a0ed84b700175530c5', {
            name: "Reidner",
            email: "jest@gmail.com",
            tags: "vba,node",
            password:"123"
          })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR USUÁRIO
describe('Users_List', () =>{
    it('Listar usuário e retornar status 204', async () =>{
        const response = await api.get('/users/5f5c15a0ed84b700175530c5', {})

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR RANKING
describe('Users_Ranking', () =>{
    it('Listar ranking e retornar status 204', async () =>{
        const response = await api.get('/ranking')

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR TODOS
describe('Users_All', () =>{
    it('Listar todos usuários e retornar status 204', async () =>{
        const response = await api.get(`/users`, {
            headers: { search_text: "" },
            params: { page:1 }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR Bloqueados
describe('Users_ListBlocks', () =>{
    it('Listar bloqueados e retornar status 204', async () =>{
        const response = await api.get(`/users/5f0ce694a8119330ecc59fa9`, {})

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//Bloquear usuário
describe('Users_Blocks', () =>{
    it('Bloquear usuário e retornar status 204', async () =>{
        const response = await api.post(`/users/5f4ee58a569cb22e84ae5b14/block`, {}, { headers: { user_id: "5f0ce694a8119330ecc59fa9" } })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//Alterar Foto
describe('Users_UpdatePhoto', () =>{
    it('Alterar foto e retornar status 204', async () =>{
        const data = new FormData();
        data.append('file', { uri: localUri, name: filename, type })
        const response = await api.post(`/users/${route.params.userId}/photo`, data)

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});
