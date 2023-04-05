//Cambiar lo de abajo para enlazarlo con frontend para q se llame cuando un boton haga click onClick event handler
// validar el telefono sea de 12 digitos y que no contenga caracteres que no sean numberos ni guiones (tal vez)
// para llamar a otro metodo q le diga al usuario que esta mal

$(document).ready(function(){
////////////   INSERT MODAL    ////////////////
    // Open INSERT modal window
    $('#buttonAdd').click(function(){
        $('#modalInsert').modal('show');
      });
    // Close INSERT modal window
    var modalInsert = $('#modalInsert');
    var closeButton = $('.modal-close')
    closeButton.on('click',function(){
        modalInsert.modal('hide');
    })
    // Close INSERT modal window with esc key
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
          $('#modalInsert').modal('hide');
        }
      });
////////////   UPDATE MODAL    ////////////////
    // Open UPDATE modal window
    $('#buttonEdit').click(function(){
        $('#modalEdit').modal('show');
        console.log('Hola mundo');
      });
    // Close UPDATE modal window
    var modalEdit = $('#modalEdit');
    var closeButton = $('.modal-close')
    closeButton.on('click',function(){
        modalEdit.modal('hide');
    })
    // Close UPDATE modal window with esc key
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
          $('#modalEdit').modal('hide');
        }
      });

    

    // Insert to database 
    function insert() {
        var first_name = $('#first-name').val();
        var last_name = $('#last-name').val();
        var phone1 = $('#phone1').val();
        var phone2 = $('#phone2').val();
        var phone3 = $('#phone3').val();
        var phone_number = phone1 + '-' + phone2 + '-' + phone3;
        console.log(phone_number, first_name, last_name);
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/insert",
            data: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(response){
                console.log(response);
                $('#first-name').val('');
                $('#last-name').val('');
                $('#phone1').val('');1
                $('#phone2').val('');
                $('#phone3').val('');
                modalUpdate.modal('hide');
                location.reload();
            },
            error: function(xhr, status, error){
                console.log(xhr.responseText);  
            }
        });
    }
    $('#buttonInsert').click(function(){
        insert();
    });
    $('input').keypress(function(e) {
        if (e.which == 13) { 
          insert(); 
          return false; 
        }
    });

    // Dynamic list
    var dataContainer = $('<div class="data-container"></div>');
    $.ajax({
        url: 'http://localhost:5000/contacts',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            // Iterate over the query made by python to create a new div element
            $.each(data.contacts,function(index, contact){
                var newContact = $('<div class="data" id="'+ contact.contact_id + '">' +
                                        '<div class="data-content">'+
                                            '<h3 class="name">' + 
                                                contact.first_name + ' ' + contact.last_name +                                                    
                                            '</h3>' +
                                            '<div><i class="bx bxs-phone phone"></i><span>'+ contact.phone_number +'</span></div>' +
                                        '</div>' + 
                                        '<div class="edit-container">' +
                                            '<button type="button" data-toggle="modal" data-target="#modalEdit" id="buttonEdit" ><i class="bx bxs-edit edit"></i></button>' +
                                        '</div>' +
                                        '<div class="delete-container">' +
                                            '<div class="delete-box"><i class="bx bxs-trash delete"></i></div>' +
                                        '</div>' +
                                    '</div>');
                dataContainer.append(newContact);
            });
            // Append the dataContainer to the #contacts-container element
            $('#contacts-container').append(dataContainer);
        },
        error: function(xhr,status,error) {
            console.log('Error: '+ error.message);
        }
    });

    // Delete row 
    $(document).on('click', '.delete-box',function() {
        var id = $(this).closest('.data').attr('id'); 
        $.ajax({
            url: 'http://localhost:5000/delete/' + id,
            type: 'DELETE',
            success: function(response) {
                console.log(response.message);
                console.log(id);
                $('#'+ id).remove();
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

});