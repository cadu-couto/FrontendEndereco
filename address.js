var res_client_id = null;
var res_address_id = null;


function pressSearchClient() {
   const cpf = document.getElementById('cpf');
   res_document_number = cpf.value;
   renderClient(cpf.value);
}


function pressSearchAddress() {
   renderAddress(this.res_client_id);
}


function pressSearchCep() {
   let label_cep = document.getElementById('label_cep');
   renderCep(label_cep.value);
}


function pressInsertAddress() {
   if (res_client_id == null) {
        alert("Erro: Selecione um cliente!");
        return;
   }
   callInsertAddress();
}


function pressGetDistanceToSuport() {
   if (res_client_id == null) {
        alert("Erro: Selecione um cliente!");
        return;
   }
   if (res_address_id == null) {
        alert("Erro: Busque o endereço do cliente");
        return;
   }
   renderDistanceToSuport();
}


$(document).ready(function () {
    $('#datatable').DataTable();
})


async function renderDistanceToSuport() {
    var suportList = await getDistanceToSuport();
    console.log('len >>' +suportList.length);
    var t = $('#datatable').DataTable();
    t.rows().remove();
    for (var i = 0; i < suportList.length; i++) {
        console.log(JSON.stringify(suportList[i]));
        var suport = JSON.stringify(suportList[i]);
        var s2 = JSON.parse(suport);
        t.row.add([s2.address, s2.distance_km]).draw();
     }
 }


async function callInsertAddress() {
    var res = await insertAddress();
   if (res.status == 200) {
        alert("Endereço criado com sucesso!");
        return;
   } else {
        console.log('Erro retorno >>' + await res.json());
        alert("Erro: Erro na criação do Endendereço. Status=" + res.status);
   }

}


function pressUpdateAddress() {
   if (res_address_id == null) {
        alert("Erro: Nenhum endereço selecionado!");
        return;
   }
   res = updateAddress();
   if (res.sucess == false) {
        alert("Erro: " + res.msg);
        return;
    } else {
        alert("Endereço Atualizado com sucesso!");
    }
}


function pressDeleteAddress() {
   if (res_address_id == null) {
        alert("Erro: Nenhum endereço selecionado!");
        return;
   }
   res = deleteAddress();
   if (res.sucess == false) {
        alert("Erro: " + res.msg);
        return;
    } else {
        alert("Endereço Apagado com sucesso!");
    }
}


async function renderClient(document_number) {
    let res = await getClient(document_number);
    if (res.sucess == false) {
        alert("Erro: " + res.msg);
        return;
    }
   let label_name = document.getElementById('label_name');
   label_name.value = res.client.name;
   this.res_client_id = res.client.client_id;
}


async function getClient(document_number) {
    console.log('Call Search Cliente');
    let url = 'http://127.0.0.1:8080/client/search';
     let formData = new FormData();
     formData.append("document_number", document_number)
     let res = await fetch(url, {
             method: "post",
             body: formData
     });
     return await res.json();
}


async function renderAddress(res_client_id) {
    if (res_client_id == null) {
        alert("Erro: Cliente não selecionado");
        return;
    }
    let res = await getAddress(this.res_client_id);
     if (res.sucess == false) {
        alert("Erro: " + res.msg);
        return;
    }
    this.res_address_id = res.address.address_id;
    let label_cep = document.getElementById('label_cep');
    label_cep.value = res.address.cep;
    let label_localidade = document.getElementById('label_localidade');
    label_localidade.value = res.address.street;
    let label_numero = document.getElementById('label_numero');
    label_numero.value = res.address.number;
    let label_complemento = document.getElementById('label_complemento');
    label_complemento.value = res.address.complement;
    let label_bairro = document.getElementById('label_bairro');
    label_bairro.value = res.address.neighborhood;
    let label_cidade = document.getElementById('label_cidade');
    label_cidade.value = res.address.city;
    let label_estado = document.getElementById('label_estado');
    label_estado.value = res.address.state;
}


async function renderCep(cep) {
    let res = await getCep(cep);
     if (res.sucess == false) {
        alert("Erro: CEP não localizado");
        return;
    }
    let label_localidade = document.getElementById('label_localidade');
    label_localidade.value = res.address.street;
    let label_bairro = document.getElementById('label_bairro');
    label_bairro.value = res.address.neighborhood;
    let label_cidade = document.getElementById('label_cidade');
    label_cidade.value = res.address.city;
    let label_estado = document.getElementById('label_estado');
    label_estado.value = res.address.state;
}


async function getAddress(res_client_id) {
    let url = 'http://127.0.0.1:8080/client/address';
     let formData = new FormData();
     formData.append("client_id", res_client_id);
     let res = await fetch(url, {
             method: "post",
             body: formData
     });
     return await res.json();
}


async function insertAddress() {
    let url = 'http://127.0.0.1:8080/address';
    let formData = new FormData();
    formData.append("address_id", '');
    formData.append("client_id", this.res_client_id);
    formData.append("type", 'client');
    formData.append("cep", document.getElementById('label_cep')?.value);
    formData.append("street", document.getElementById('label_localidade')?.value);
    formData.append("number", document.getElementById('label_numero')?.value);
    formData.append("complement", document.getElementById('label_complemento')?.value);
    formData.append("neighborhood", document.getElementById('label_bairro')?.value);
    formData.append("city", document.getElementById('label_cidade')?.value);
    formData.append("state", document.getElementById('label_estado')?.value);
     let res = await fetch(url, {
             method: "POST",
             body: formData
     });
     return await res;
}


async function updateAddress() {
    let url = 'http://127.0.0.1:8080/address';
    let formData = new FormData();
    formData.append("client_id", this.res_client_id);
    formData.append("address_id", this.res_address_id);
    formData.append("type", 'client');
    formData.append("cep", document.getElementById('label_cep').value);
    formData.append("street", document.getElementById('label_localidade').value);
    formData.append("number", document.getElementById('label_numero').value);
    formData.append("complement", document.getElementById('label_complemento').value);
    formData.append("neighborhood", document.getElementById('label_bairro').value);
    formData.append("city", document.getElementById('label_cidade').value);
    formData.append("state", document.getElementById('label_estado').value);
     let res = await fetch(url, {
             method: "put",
             body: formData
     });
     console.log('Status >>' +res.status);
     return await res.json();
}


async function deleteAddress() {
    let url = 'http://127.0.0.1:8080/address';
    let formData = new FormData();
    formData.append("address_id", this.res_address_id);
     let res = await fetch(url, {
             method: "delete",
             body: formData
     });
     return await res.json();
}


async function getCep(cep) {
    let url = 'http://127.0.0.1:8081/address_by_cep';
    let formData = new FormData();
    formData.append("cep", cep);
    let res = await fetch(url, {
             method: "post",
             body: formData
     });
     return await res.json();
}


async function getDistanceToSuport() {
    let url = 'http://127.0.0.1:8080/address/shortest_distance_to_suport';
    let formData = new FormData();
    formData.append("client_id", this.res_client_id);

    let res = await fetch(url, {
        method: "post",
        body: formData
     });
     console.log('Status >>' +res.status);
     return await res.json();
}