const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const port = 3000
const app = express()
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,"html")))

app.listen(port, ()=>{
    console.log(`Conectado à porta ${port}`)
})
app.get('/', async(req,res)=>{
    res.sendFile(path.join(__dirname,"html","login.html"))
})
app.post('/users', async(req,res)=>{
    try{
        const {nome, senha} = req.body
        const user = await prisma.user.findFirst({ 
            where:{
                nome:nome,
                senha:senha
            }})
        if(user){
            console.log(`Sucesso ao encontrar ${nome}`)
            res.json({sucesso:true, menssagem:`${nome} encontrado`})
        }
        else{
            console.error('Não encontrado')
            res.json({menssagem:`${nome} Não encontrado`})
        }
    }
    catch(error){console.error('Busca interrompida :C')}
})
app.get('/users', async (req,res)=>{
    try{
         const busca = await prisma.user.findMany()
         res.json(busca)
    }
    catch(error){
        console.error("Erro ao buscar todos os registros")
    }
})
app.get('/segunda',(req,res)=>{
    res.sendFile(path.join(__dirname,"html", "segunda.html"))
})
app.post('/salvar', async(req,res)=>{
    try{
       const {nome, populacao,exercito,felicidade,popularidade,lucro,banco,comida,corText,corInput} = req.body
       const busca = await prisma.user.findUnique({
        where:{nome}
       })
       const atualiza = await prisma.user.update({
        where: {nome},
        data:{
            populacao,
            exercito,
            felicidade,
            popularidade,
            lucro,
            banco,
            comida,
            corText,
            corInput
        }
       })
       res.json({menssagem:'Sucesso ao salvar os dados!!!'})
    }
    catch(error){
        console.error('Erro ao salvar dados', error)
        res.json({menssagem:'erro ao salvar os dados'})
    }
})
app.post('/salvarImagem', upload.single("imagem"),async(req,res)=>{
    try{
        const nome = req.body.nome
        const imagem = req.file?.buffer
        await prisma.user.update({
            where:{nome},
            data:{
                imagem
            }
        })
        console.log('Imagem salva com sucesso!!!')
        res.json('Imagem salva com sucesso!!!')

    }
    catch(error){
        console.error('Erro ao tentar salvar imagem')
        res.json({menssagem:'Erro ao tentar salvar imagem'})
    }
})
app.post('/log',async(req,res)=>{
    const nome = req.body.nome
    const user = await prisma.user.findUnique({where:{nome}})
    res.json(user)
})
app.post('/create', async(req,res)=>{
    const {nome, senha} = req.body;
    try{
        const create = await prisma.user.create({
            data:{
                nome:nome,
                senha:senha
            },
        })
        console.log('Registro criado com sucesso!!!', create)
    }
    catch(error){
        console.error('Erro ao criar novo registro')
        res.json(error)
    }
})

