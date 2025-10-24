document.addEventListener("DOMContentLoaded", () => {
    /* Variables of DOM */ 
    const txtSecretKey = document.getElementById("txtSecretKey");
    const txtWord = document.getElementById("txtWord");
    const txtResult = document.getElementById("txtResult");

    const btnEncrypt = document.getElementById("btnEncrypt");
    const btnDecrypt = document.getElementById("btnDecrypt");
    const divAlert = document.getElementById("divAlert");
    
    /* Initial DOM */
    divAlert.style.display = "none";
    txtSecretKey.value = "yiKRn4wrzAMjw98QrlyF3QvFSrL3tudRjCKxGnqTzOM=";
    txtWord.value = "";
    txtResult.value = "";
    
    /* Actions of buttons */
    btnEncrypt.addEventListener("click", function(){
        if(txtSecretKey.value === ""){
            divAlert.textContent = "Value of Secret Key was null or empty.";
            divAlert.style.display = "block";
            return;
        } 
        if(txtWord.value === ""){
            divAlert.textContent = "It hasn't a word for work.";
            divAlert.style.display = "block";
            return;
        }
        
        divAlert.style.display = "none";
        const wordEncrypted = window.functions._encrypt(txtWord.value, txtSecretKey.value);
        txtResult.value = wordEncrypted;
    });

    btnDecrypt.addEventListener("click", function(){
        if(txtSecretKey.value === ""){
            divAlert.textContent = "Value of Secret Key was null or empty.";
            divAlert.style.display = "block";
            return;
        } 
        if(txtWord.value === ""){
            divAlert.textContent = "It hasn't a word for work.";
            divAlert.style.display = "block";
            return;
        }
        
        divAlert.style.display = "none";
        const wordEncrypted = window.functions._decrypt(txtWord.value, txtSecretKey.value);
        txtResult.value = wordEncrypted;
    });
});