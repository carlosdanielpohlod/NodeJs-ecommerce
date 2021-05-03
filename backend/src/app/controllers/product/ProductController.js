
const {product} = require('../../models')
const httpStatus = require('../enum/httpStatus')
const {sequelizeOrGeneric} = require('../utils/errorFormat')
class CreateProductController {
    async store(req, res){
        try{       
            const data = req.body 
            !data? res.status(400).send({msg:httpStatus["400"].value, status:false}) : null
            const response = await product.create(data)
            return res.status(201).send({msg:httpStatus["201"].value, status:true, data:response})        
        }
        catch(err){
            sequelizeOrGeneric(err, res)
        }
    }

    async update(req, res){
        try{       
            const data = req.body 
            !data? res.status(400).send({msg:httpStatus["400"].value, status:false}) : null
            const response = await product.update(data, {where:{idProduct:req.body.idProduct}})
            res.status(201).send({msg:httpStatus["201"].value, status:true, data:response})        
        }
        catch(err){
            sequelizeOrGeneric(err, res)
        }
    }

    async delete(req, res){
        try{
            const {purchaseitem, stock} = require('../../models')
            !req.body? res.status(400).send({msg:httpStatus["400"].value, status:false}) : null
            
            let response = await  purchaseitem.findAll({
                attributes:['idPurchaseItem'],
                include: [{
                  model: stock,
                  where: {idProduct: req.body.idProduct},
                  attributes:[]
                }]
                
            })
            
            
            if(response[0] && response[0].dataValues.idPurchaseItem){
                res.status(400).send({msg:'Não deletado, existem compras ou carrinhos que incluem esse produto', status:false}) 
                return 
            }else{
                await product.destroy({where:{idProduct:req.body.idProduct}})
                res.status(200).send({msg:httpStatus["200"].value, status:true}) 
                return
            }
        }
        catch(err){

           return res.status(500).send({msg:httpStatus['500'].value, status:false}) 
        }
    }

    async getDetailsById(req, res){
        const {stock, product, color, category,brand} = require('../../models')
        const result = await stock.findAll({
            include: 
            [
                {
                    model: product,
                    attributes:["name","price","description","idProduct"],
                    include:
                    [
                        {
                            model:category,
                            attributes:["category"]
                        },
                        {
                            model:brand,
                            attributes:["brand"]
                        }
                    ]

                },
                {
                    model:color,
                    attributes:["color"]
                }
            ]
        },{where:{idProduct:req.params.idProduct}})
        return res.send(result)


        
    }
}
module.exports = new CreateProductController()

  
  


