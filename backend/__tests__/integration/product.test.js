const request = require('supertest')

const app = require('../../src/app')

describe('Product resgister validation', () => {
  
    it('Shold throws a fail because incorrectly price', async (done) => {
        const authUser = await request(app)
                        .post('/signin')
                        .send({email:'admin@seed.com',password:'12345'})
        thisUser = authUser.body.data

        const response = await request(app)
                        .post('/product')
                        .set('Authorization',`Bearer ${thisUser.token}`)
                        .send({
                                name:"sjsjs",
                                price:"4.d50",
                                idProvider:1,
                                description:"Produto para teste",
                                idCategory:1,
                                idProductStatus:1,
                                idBrand:1
                            })
        expect(response.status).toBe(400)
        done()
    })

    it('Shold throws a fail with invalide user privilege', async (done) => {
        const authUser = await request(app)
                        .post('/signin')
                        .send({email:'user@seed.com',password:'12345'})
        thisUser = authUser.body.data

        const response = await request(app)
                        .post('/product')
                        .set('Authorization',`Bearer ${thisUser.token}`)
                        .send({
                                name:"sjsjs",
                                price:"4.50",
                                idProvider:1,
                                description:"Produto para teste",
                                idCategory:1,
                                idProductStatus:1,
                                idBrand:1
                            })
        expect(response.status).toBe(401)
        done()
    })

    it('Shold create with success', async (done) => {
        const authUser = await request(app)
                        .post('/signin')
                        .send({email:'admin@seed.com',password:'12345'})
        thisUser = authUser.body.data

        const response = await request(app)
                        .post('/product')
                        .set('Authorization',`Bearer ${thisUser.token}`)
                        .send({
                                name:"Produto autorizado",
                                price:"4.50",
                                idProvider:1,
                                description:"Produto para teste",
                                idCategory:1,
                                idProductStatus:1,
                                idBrand:1
                            })
        expect(response.status).toBe(201)
        done()
    })
})