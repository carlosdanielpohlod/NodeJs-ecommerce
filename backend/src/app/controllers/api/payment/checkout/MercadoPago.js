// const CheckoutInterface = require('./CheckoutInterface')
const config = require('../../../../../config/mercadoPago')
const axios = require('axios')

class MercadoPago{

    constructor(){

        this.mercadopago = require ('mercadopago');
        this.mercadopago.configure({... config.credentials});
        
    }
    async createPaymentLink(data){
        try{
            const {formatItems, formatPayer} = require('../../../utils/mercadoPago')
            const items = formatItems(data)
            const payer = formatPayer(data)

            const response = await this.mercadopago.preferences.create({
                items, payer,  ...config.config})
              
            return response.body
         }
        catch(err){
            return {status:false, err}
        }

    }
    
    async getPayment(data){
        
    
       return axios.get(data.url,{
            headers:{
                Authorization:`Bearer ${config.credentials.access_token}`
            }
        })
        .then(response => {
                // console.log()
            return {status:true, data:response.data.collection}
            
        })
        .catch(err => {
            return {status:false, msg:err.message}
        })
        
    }




    isCreatedPaymentStatus(body){
        if(body.action == "payment.created"){
            return true
        }else{
            return false
        }
    }

    isUpdatedPaymentStatus(body){
        if(body.action == "payment.updated"){
            return true
        }else{
            return false
        }
    }
    

    formatRequestData(body){
        
        if(body.status){
            return {status:this.mapedStatus()[body.status],payer:{email:body.payer.email, cpf:body.payer.identification.number, idUser:body.payer.id}, dateCreated:date_created}
        }else{
            return false
        }
    }
   
    mapedStatus(){
        return { 
            success: purchaseStatus["compra_concluida"].value,
            cancelled: purchaseStatus["cancelado"].value,
            rejected: purchaseStatus["compra_rejeitada"].value,
            pending: purchaseStatus["aguardando_pagamento"].value,
            opened: purchaseStatus["pagamento_em_aberto"].value,
            in_process: purchaseStatus["processando_pagamento"].value,
            authorizated: purchaseStatus["pagamento_autorizado_mas_nao_concluido"].value,
        }
    }
    

}

module.exports = new MercadoPago()