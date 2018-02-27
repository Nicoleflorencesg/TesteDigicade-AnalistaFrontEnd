function openNav() {
    document.getElementById("mySidenav").style.width = "97%";
    document.getElementById("iconeMenu").style.display = "none";
    document.getElementById("iconeMapa").style.display = "inline";
    document.getElementById("iconeTresPontos").style.display = "inline";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("iconeMapa").style.display = "none";
    document.getElementById("iconeMenu").style.display = "inline";
    document.getElementById("iconeTresPontos").style.display = "inline";
}

function toggleFormView() {
    isEdition = false;
    $('input').val('');
    $("#formulario").slideDown(0);
    $("#botaoCancelar").slideDown(0);
    $("#clientes").slideUp(300);
}

function cancelar() {
    $("#formulario").slideUp(300);
    $("#botaoCancelar").slideUp(300);
    $("#clientes").slideDown(300);
}

function initMap() {
    document.getElementById("clientes").style.display = "inline";
    document.getElementById("formulario").style.display = "none";
    document.getElementById("botaoCancelar").style.display = "none";
    carregarPontos();
}


function carregarPontos() {
    $.ajax({
        type: "GET",
        url: "http://app.digicade-hml.com.br/frontend-api/clientes",
        contentType: "application/json",
        success: function (data) {
            console.log(data)
            this.qtd = data._embedded.clientes.length;
            tr = '';
            for (i = 0; i < this.qtd; i++) {
                this.cliente = data._embedded.clientes[i];
                console.log(this.cliente._links.self.href);
                tr +=
                    '<tr>' +
                    '<td class="fontLista">' + '<a onclick="preencheForm(this.cliente)">' + data._embedded.clientes[i].nome + '</a>' + '</td>' +
                    '<td class="fontLista">' + data._embedded.clientes[i].telefone + '</td>' +
                    '<td class="fontLista">' + '<a onclick="editaCliente(\'' + this.cliente.nome + '\',\'' + this.cliente.cpf + '\',\'' + this.cliente.telefone + '\',\'' + this.cliente.email + '\',\'' + this.cliente.latitude + '\',\'' + this.cliente.longitude + '\',\'' + this.cliente._links.self.href + '\')">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + '</a>' + '<a style="margin-left:20px;" onclick="deletaCliente(\'' + this.cliente._links.self.href + '\' )">' + '<i class="fa fa-close" aria-hidden="true"></i>' + '</a>' + '</td>' +
                    '</tr>';
            }
            $('#grid').find('tbody').html(tr);

            var uluru = {
                lat: data._embedded.clientes[0].latitude,
                lng: data._embedded.clientes[0].longitude
            }

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: uluru
            });

            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });

            $.each(data._embedded.clientes, function (index, ponto) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng({
                        lat: ponto.latitude,
                        lng: ponto.longitude
                    }),
                    map: map
                });
            });
        }
    });
}

function deletaCliente(client_url) {
    $.ajax({
        type: "DELETE",
        url: client_url,
        contentType: "application/json",
        success: function (data) {
            if (data !== false) {
                carregarPontos();
                alert('Registro removido com sucesso!');
            }
        }
    });
}

function editaCliente(nome, cpf, telefone, email, latitude, longitude, href) {
    toggleFormView();
    isEdition = true;
    $("#nome").val(nome);
    $("#cpf").val(cpf);
    $("#telefone").val(telefone);
    $("#email").val(email);
    $("#latitude").val(latitude);
    $("#longitude").val(longitude);
    $("#href").val(href);
}

function validate() {
    if ($("#nome").val() != "" && $("#latitude").val() != "" && $("#longitude").val() != "")
        return true
    else
        return false
}
