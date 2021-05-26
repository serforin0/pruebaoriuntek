const http=require('http');
const express=require('express');
const app=express();
const sqlite3=require('sqlite3').verbose();
const path=require('path');

//ubicacions de los recuersos 
app.use(express.static(__dirname+'/'));

//configuracion del servidor
app.set("view engine", "ejs");//motor de plantillas con ejs
app.set("views", path.join(__dirname, ""));
app.use(express.urlencoded({extended:false}));//para recuperar los valores publicados en request
app.listen(5000);
console.log("el servidor esta vivo VIVO!!!!!!");

//configuradon la base de datos

const db_name = path.join(__dirname, "db", "base.db");
const db=new sqlite3.Database(db_name, err => {
    if(err) {
        return console.error(err.message);
    }else {
        console.log("Eureca ya estas conectado!!!!")
    }
});//pansandole el nombre de la bd a una nueva instancia de sqlite3 y por ultimo revisando algun error

//creando la tabla empresa

const sql_create = "CREATE TABLE IF NOT EXISTS Empresas(empresa_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR (150) NOT NULL, Propietario VARCHAR (150) NOT NULL, Descripcion Text);";
const sql_clientes = "CREATE TABLE IF NOT EXISTS Clientes(cliente_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre VARCHAR (150) NOT NULL,empresa_ID INTEGER, CONSTRAINT fk_empresas  FOREIGN KEY (empresa_ID) REFERENCES Empresas(empresa_ID));";
const sql_direcciones = "CREATE TABLE IF NOT EXISTS Direciones(direccion_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, calle VARCHAR (150) NOT NULL,cliente_ID INTEGER, CONSTRAINT fk_cliente  FOREIGN KEY (cliente_ID) REFERENCES Clientes(cliente_ID));";


db.run(sql_create, err =>{

    if(err) {
        return console.error(err.message);
    }else {
        console.log("tablas creadas!!!!")
    }

})

db.run(sql_clientes, err =>{

    if(err) {
        return console.error(err.message);
    }else {
        console.log("tabla clientes creada!!!!")
    }

})

db.run(sql_direcciones, err =>{

    if(err) {
        return console.error(err.message);
    }else {
        console.log("tabla Direcciones creada!!!!")
    }

})


// enrutamiento

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/acercade', (req, res) => {
    res.render('acercade.ejs')
})

app.get('/crearEmpresa', (req, res) => {
    res.render('crearEmpresa.ejs', {modelo: {}})
})

app.post('/crearEmpresa', (req, res)=>{
    const sql="INSERT INTO Empresas( nombre,Propietario ,Descripcion) VALUES(?, ?, ?)";
    const nuevaEmpresa = [req.body.nombre, req.body.Propietario, req.body.Descripcion];
    //const nuevaEmpresa = ["colmado tejadas", "pedro tejada", "clomado para la venta de productos"];
    db.run(sql, nuevaEmpresa, err=>{
        if(err) {
            return console.error(err.message);
        }else{
            res.redirect("/empresa");
        }
    })
})


// metodos post y get para editar
app.get("/editar/:id", (req, res)=>{
    const id=red.params.id;
    const sql="SELECT * FROM Empresas WHERE empresa_ID=?";
    db.get(sql, id,(err, row)=>{
        res.render("editar.ejs", {modelo: rows});
    })

    //post editar
    app.post("/editar/:id", (req, res)=>{
        const id = req.params.id;
        const info_empresa=[req.body.nombre, req.body.Propietario, req.body.Descripcion, id];
        const sql = "UPDATE Empresas SET nombre=?, Propietario=?, Descripcion=? WHERE (empresa_ID=?)";
        db.run(sql, info_empresa, err =>{
            if(err){
                return console.error(err.message);
            }
        })
    })

})

// app.get('/empresa', (req, res) => {
//     res.render('empresa.ejs')
// })

app.get('/contacto', (req, res) => {
    res.render('contacto.ejs')
})

//mostrando todas las empresas
app.get('/empresa', (req, res) =>{
    const sql = "SELECT * FROM Empresas ORDER BY  nombre";
    db.all(sql, [], (err, rows)=>{
        if(err){
            return console.error(err.message);
        }else{
            res.render("empresa.ejs", {modelo:rows});
        }
    })
})

//este metodo siempre debe estar al final
app.get('/*', (req, res)=>{
    res.render('notfound.ejs')
})