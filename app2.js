/*
Secciones:

1.- Declarar variable para obtener información de localStorage
2.- Variables de index.html y content.html
3.- Condicional para personalizar saludo de entrada
4.- Funciones para eventos
    4.1 logIn
    4.2 logOut
    4.3 Activar div con formulario para Depositar
    4.4 Activar div con formulario para Retirar
    4.5 Consulta de saldo
    4.6 Ejecutar transacción (Deposito y Retiro)
    4.7 Actualizar localStorage
*/ 

// 1.- Declarar variable para obtener información de localStorage
let usersNew = JSON.parse(localStorage.getItem('usuariosNew'));

// 2.- Variables de index.html y content.html

// 2.1 - Variables index.html:
const formLogin = document.querySelector("#form"); 
const inputUsuario = document.querySelector("#inputUser"); 
const inputContraseña = document.querySelector("#inputPass");


// 2.2 - variables content.html:
const aSaldo = document.querySelector("#activarSaldo");
const aDeposit = document.querySelector("#acivarDeposito");
const aRetiro = document.querySelector("#activarRetiro");
const confirmar = document.querySelector("#confirmarTransaccion");
const formTransaccion = document.querySelector("#ingresarDatos");
const definirMonto = document.querySelector("#pantalla");
const seccionAlertas = document.querySelector("#showEvents");
let outputAlerta = document.querySelector("#pSuperior");
let outputResultado = document.querySelector("#pInferior");
let saludo = document.querySelector("#userWelcome"); // span para personalizar saludo
let guardarDeposito ="";
let guardarRetiro="";
const cerrarSesion = document.querySelector("#logOut");
let userLogData = "";

// 3.- Condicional para personalizar saludo de entrada

if (localStorage.logged){
saludo.innerHTML = JSON.parse(localStorage.logged).usuario;
};

// 4.- Funciones

// 4.1 - Login
formLogin.addEventListener("submit", (e)=>{
    e.preventDefault();
   if(!usersNew) {
    let users = [
        {usuario: "Mali", contraseña: "1234", saldo: 990},
        {usuario: "Gera", contraseña: "5678", saldo: 10},
        {usuario: "Maui", contraseña: "9101", saldo: 850},
    ];
    let storeData = JSON.stringify(users);
    localStorage.setItem("usuariosNew", storeData);
    
    users.forEach(item => {
        const {usuario, contraseña, saldo} = item;

        if(inputUsuario.value == usuario && inputContraseña.value == contraseña){
            window.location.assign("./content.html");
            localStorage.setItem("logged", JSON.stringify(item));
            
        } else{
            document.getElementById("accessDenied").classList.remove('invalid-feedback');
            document.getElementById("accessDenied").classList.add('is-invalid');
        }
    })} else {
        usersNew = JSON.parse(localStorage.getItem('usuariosNew'));

        usersNew.forEach(item => {
            const {usuario, contraseña, saldo} = item;
    
            if(inputUsuario.value == usuario && inputContraseña.value == contraseña){
                window.location.assign("./content.html");
                localStorage.setItem("logged", JSON.stringify(item));
                
                
            } else{
                document.getElementById("accessDenied").classList.remove('invalid-feedback');
                document.getElementById("accessDenied").classList.add('is-invalid');
            }
        })
        
    }

formLogin.reset();
});

// 4.2 logOut 

function logOut(){ 
localStorage.removeItem("logged");
localStorage.removeItem("retiro");
localStorage.removeItem("deposito");
cerrarSesion.setAttribute("href","./index.html");
};


// 4.3 Activar div con formulario para Depositar

function checkDeposito(){
    userLogData = JSON.parse(localStorage.logged);
    if(userLogData.saldo >= 990){
        formTransaccion.classList.add("hidden");
        outputAlerta.classList.remove("hidden");
        outputResultado.classList.add("hidden");
        outputAlerta.innerHTML = `<h3>Tu saldo está al límite permitido, realice otra operación. </h3> `
    } else {
        definirMonto.value="";
        outputAlerta.classList.remove("hidden");
        outputAlerta.textContent = "Favor de ingresar cantidad a depositar:"
        outputResultado.classList.add("hidden");
        formTransaccion.classList.remove("hidden");
        confirmar.value = "depositar";
    }
};

// 4.4 Activar div con formulario para Retirar

function checkRetiro(){
    userLogData = JSON.parse(localStorage.logged);
   if(userLogData.saldo <= 10){
    formTransaccion.classList.add("hidden");
        outputAlerta.classList.remove("hidden");
        outputResultado.classList.add("hidden");
        outputAlerta.innerHTML = `<h3>Tu saldo está al límite permitido, realice otra operación. </h3> `
   } else {
    definirMonto.value="";
    outputAlerta.classList.remove("hidden");
    outputAlerta.textContent = "Favor de ingresar cantidad a retirar:"
    outputResultado.classList.add("hidden");
    formTransaccion.classList.remove("hidden");
    confirmar.value = "retirar";
   }
}

// 4.5 Consulta de saldo

function checkSaldo(){
    userLogData = JSON.parse(localStorage.logged);
    outputResultado.classList.remove("hidden");
    outputAlerta.classList.add("hidden");
    formTransaccion.classList.add("hidden")
    outputResultado.innerHTML = `<h1>Tu saldo es: $ ${userLogData.saldo} </h1> `;
}

// 4.6 Ejecutar transacción (Deposito y Retiro)

function ejecutar(){
    userLogData = JSON.parse(localStorage.logged); // Llamar información de usuario conectado

// 4.6.1 Ejecutar deposito
    //1) Evalua el valor del botón, para saber que acción realizar
   if(confirmar.value==="depositar"){

    // 2) Evalua las reglas de negocio y evita valores en negativo
    if ((parseFloat(definirMonto.value) + userLogData.saldo) <= 990 && parseFloat(definirMonto.value)>0 ){

        localStorage.setItem("deposito", JSON.stringify(definirMonto.value)); // guarda  monto ingresado a localStorage
        guardarDeposito = parseFloat(JSON.parse(localStorage.deposito)); // obtiene el monto ingresado desde localStorage
        userLogData.saldo += guardarDeposito;
        localStorage.setItem("logged",JSON.stringify(userLogData)); // guarda en localStorage saldo actualizado de la cuenta activa.
        outputAlerta.classList.remove("hidden");
        outputResultado.classList.remove("hidden");
        outputAlerta.innerHTML = `<h2> El monto depositado es: $ ${guardarDeposito} </h2> `;
        outputResultado.innerHTML = `<h2>Tu nuevo saldo es: $ ${userLogData.saldo} </h2> `;
        formTransaccion.classList.add("hidden");
        definirMonto.value="";
       updateUser(); // ejecuta función para actualizar la base de datos de usuarios.

    // 3) Evita valores en 0 y valores negativos
    } else if(definirMonto.value=="" || definirMonto.value <= 0){
        outputAlerta.innerHTML = `<h2> Favor de ingresar monto válido </h2> `;
    
    // 4) Impide ejecutar transacción, para respetar regla de negocio.
    } else{
        outputAlerta.innerHTML = `<h2> No es posible ingresar este monto, ya que excedería el limite de cuenta, intente con otra cantidad </h2> `;

    }}

// 4.6.2 Ejecutar retiro
    else {
        if ((userLogData.saldo-parseFloat(definirMonto.value)) >= 10 && definirMonto.value > 0){
            localStorage.setItem("retiro", JSON.stringify(definirMonto.value));
            guardarRetiro = parseFloat(JSON.parse(localStorage.retiro));
            userLogData.saldo -= guardarRetiro;
            localStorage.setItem("logged", JSON.stringify(userLogData));
            outputAlerta.classList.remove("hidden");
            outputResultado.classList.remove("hidden");
            outputAlerta.innerHTML = `<h2> El monto retirado es: $ ${guardarRetiro} </h2> `;
            outputResultado.innerHTML = `<h2>Tu nuevo saldo es: $ ${userLogData.saldo} </h2> `;
            formTransaccion.classList.add("hidden");
           updateUser();
           //definirMonto.value="";
        } else if(definirMonto.value==""|| definirMonto.value <= 0){
            outputAlerta.innerHTML = `<h2> Favor de ingresar monto válido</h2> `;
    
        } else{
            outputAlerta.innerHTML = `<h2> No es posible retirar este monto, ya que excedería el mínimo de cuenta, intente con otra cantidad </h2> `;
    }
    
}};

// 4.7 Actualizar localStorage
function updateUser(){
    userLogData = JSON.parse(localStorage.logged);
    usersNew.forEach((item)=>{
        if (userLogData.usuario === item.usuario){
            item.saldo = userLogData.saldo;
        }
        localStorage.setItem("usuariosNew", JSON.stringify(usersNew));
    });
    
};



