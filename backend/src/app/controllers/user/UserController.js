const {user} = require('../../models')
const httpStatus = require('../enum/httpStatus')
const {sequelizeOrGeneric} = require('../utils/errorFormat')
const { Op } = require("sequelize");
class UserController{
   
    async store(req, res){
        try{
            !req.body.name ? res.status(400).send({status:false, msg:httpStatus['400'].value}) : null
            let response =  await user.findOne({where:{email:req.body.email}})
            if(response != null){
                return res.status(400).send({msg:"Email já utilizado", status:false})
            }
            
            response  = await user.findOne({where:{cpf:req.body.cpf}})
            // console.log(response)
            if(response != null){
                return res.status(400).send({msg:"CPF já utilizado", status:false})
                
            }
           
            req.body.password = user.passwordHash(req.body.password) 
            req.body.idUserPrivilege = 2     
            response = await user.create(req.body)
            return res.status(201).send({status:true,msg:httpStatus['201'].value, data:response})
        }
        catch(err){
            sequelizeOrGeneric(err,res)
        }
    }

    async update(req, res){
        // try{
            const data = req.body
     
            let response =  await user.findOne({where:{email:req.body.email, idUser:{[Op.ne]:req.user.idUser}}})
            if(response != null){
                return res.status(400).send({msg:"Email já utilizado", status:false})
            }       
            response  = await user.findOne({where:{cpf:req.body.cpf,idUser:{[Op.ne]:req.user.idUser}}})
            
            if(response != null){
                return res.status(400).send({msg:"CPF já utilizado", status:false})
                
            }
            await user.update({
                name:data.name,
                cpf:data.cpf,
                email:data.email,
                birthday:data.birthday,
                surname:data.surname
            }, {where:{idUser:req.user.idUser}})

            return res.status(200).send({status:true, msg:httpStatus['200']})
        // }
        // catch(err){
        //     sequelizeOrGeneric(err,res)
        // }
    }
    async deleteOtherUser(req, res){
        const {purchase} = require('../../models')
        const purchaseStatus = require('../enum/purchaseStatus')
        const response = await purchase.findOne({
            where:{idUser:req.body.idUserDelete,
                idPurchaseStatus:{
                    [Op.or]:[
                        purchaseStatus["aguardando_pagamento"].value, 
                        purchaseStatus["pagamento_efetuado"].value, 
                        purchaseStatus["produto_em_transito"].value
                    ]
                }
            }
        })
        if(response){
           return res.send({msg:"Usuário possui compras pendentes na plataforma", status:false})
        }else{
          await user.update({deletedAt:(new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')}, {where:{idUser:req.body.idUserDelete}}) == 1? res.status(200).send({msg:httpStatus["200"].value, status:true}) : res.status(400).send({msg:'Não foi possivel deletar', status:false})      
        }
    }
    async getAll(req, res){
        try{
            const limitByPage = 10
            const page = req.body.page
            const result = await user.findAll({attributes:user.basicInfosTemplate, offset:req.body.page * limitByPage - limitByPage, limit:limitByPage})
            return res.status(200).send({status:true,data:result, limitByPage, page})
        }
        catch(err){
            return res.status(500).send({status:false, msg:httpStatus["500"].value})
        }
    }

    
    async getById(req, res){
      
            
        user.findOne({attributes:user.basicInfosTemplate, where:{idUser:req.params.idUser}})
        .then(response => {
            res.status(400).send({status:true, data:response})
        })
        .catch(err => res.status(500).send({status:false, msg:httpStatus['500'].value}))

    }



}

module.exports = new UserController()