const api = require('../../services/api')

//NOVO POST
describe('POST_New', () =>{
    it('Novo POST e retornar status 204', async () =>{
        const response = await api.post(`/posts`, {
        title:"testepost", desc:"testedesc", tags:"Node"
          }, {
            headers:{user_id: "5ef948bfb9ba3d443c82e9f7", type: false }
          })    

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LIST POST
describe('POST_ListAll', () =>{
    it('Listar todos POSTs e retornar status 204', async () =>{
        const response = await api.get('/posts', {
            headers: { user_id:"5f35e2e48973d417809ddb70", type:false , search_text: "", search_type: "" },
            params: { page:1 }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//CURTIR POST
describe('POST_LIKE', () =>{
    it('Curtir POST e retornar status 204', async () =>{
        const response = await api.post(`/posts/5edeecb5c36e0121042cf2e2/like`, {
        }, {
            headers: { user_id:"5ecdd1c0fa5c0107e0a63f9d" }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//LISTAR POST
describe('POST_LIST', () =>{
    it('LISTAR POST e retornar status 204', async () =>{
        const response = await api.get(`/post/5edeecb5c36e0121042cf2e2`, {
            headers: { user_id:"5f35e2e48973d417809ddb70" }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//DELETE POST
describe('POST_DELETE', () =>{
    it('DELETAR POST e retornar status 204', async () =>{
        const response = await api.delete(`/posts/5efbd7e873dd1b11484ecc56`, {
            headers: { user_id:"5ef948bfb9ba3d443c82e9f7" }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});

//ESCLARECER POST
describe('POST_RESOLVE', () =>{
    it('ESCLARECER POST e retornar status 204', async () =>{
        const response = await api.post(`/posts/${post._id}/${commId}/solve`, {}, {
            headers: { user_id }
        })

        //console.log(""); 
        expect(response.status).toBe(204);
    });
});