const api = require('../../services/api')

//NOVO COMENTÁRIO
describe('Comen_New', () =>{
    it('Novo comentário e retornar status 204', async () =>{
        const response = await api.post(`/posts/5efd343ddded1b097447c9a0`, {
            message: 'teste',
        }, {
            headers: { user_id: "5ef948bfb9ba3d443c82e9f7" },
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR COMENTÁRIOS
describe('Comen_List', () =>{
    it('Listar comentário e retornar status 204', async () =>{
        const response = await api.get(`/posts/5f371f8c531f9f34e0681fe6`,
        {
            headers: {user_id:  "5f4ee58a569cb22e84ae5b14" },
            params: {page: 1 } 
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//CURTIR COMENTÁRIO
describe('Comen_Like', () =>{
    it('Curtir comentário e retornar status 204', async () =>{
        const response = await api.post(`/posts/5edeecb5c36e0121042cf2e2/5eee6171ce9b3815587bbe5d/like`, {
        }, {
            headers: {user_id: "5ec72ba2fd6d6408f0ed5a8b"}
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//DELETAR COMENTÁRIO
describe('Comen_Del', () =>{
    it('Deletar comentário e retornar status 204', async () =>{
        const response = await api.delete(`/posts//5efbd7e873dd1b11484ecc56/5efbd80b73dd1b11484ecc58`, {
            headers: {user_id:"5ef948bfb9ba3d443c82e9f7"}
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});