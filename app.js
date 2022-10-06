//--- 1. Seteo de cuentas en localStorage -----------
let users = [
    {usuario: "Mali", contraseña: "1234", saldo: 990},
    {usuario: "Gera", contraseña: "5678", saldo: 10},
    {usuario: "Maui", contraseña: "9101", saldo: 850},
];
let storeData = JSON.stringify(users);
localStorage.setItem("usuarios", storeData);
//Fin de 1. -------------------------
let parsed = JSON.parse(storeData);
let hashLogIn = parsed.map(hashMap);
    function hashMap(item){
       return [item.usuario, [item.contraseña, item.saldo]]
    }

//------2.- Iniciar sesión------
let button = document.getElementById("login");
function logIn (){
    
    let persona = document.getElementById("inputUser").value;
    let pass = document.getElementById("inputPass").value;
  
   for (let key of hashLogIn){
        if (key[0]===persona && key[1][0]=== pass){
            window.location.assign("./content.html")
            sessionStorage.setItem("logged", JSON.stringify(key))
        } else{
            document.getElementById("accessDenied").classList.remove('invalid-feedback')
            document.getElementById("accessDenied").classList.add('is-invalid')
        }
   }
}
//-------- Fin de 2. ------------------


// Crear array con datos del usuario conectado 
let userLogData = JSON.parse(sessionStorage.getItem("logged"))


//------- 3.- Cerrar Sesión 
function logOff(){
    sessionStorage.clear()
}
//------- Fin de 3. ----------

// ------- 4.- Personalización de saludo ------
let saludo = document.getElementById("userWelcome")
saludo.innerHTML = userLogData[0]
// -------- Fin de 4.

let showActivity = document.getElementById("showEvents")

// -------- 5.- Consulta de saldo
function showAmount(){
    showActivity.innerHTML = "tu saldo es: " + userLogData[1][1];
}

// 6.- Depositar dinero
function payIn(){
    if (userLogData[1][1] < "990"){
        
    } else{
        showActivity.innerHTML = "Tu saldo está al límite, no se puede realizar deposito"
    }
}


// 7.- Retirar dinero
function takeOut(){
    if (userLogData[1][1] > "10"){
        
    } else{
        showActivity.innerHTML = "Tu cuenta esta con saldo mínimo, no se puede realizar retiro"
    }
}