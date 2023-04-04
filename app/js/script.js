//Cambiar lo de abajo para enlazarlo con frontend para q se llame cuando un boton haga click onClick event handler
// validar el telefono sea de 12 digitos y que no contenga caracteres que no sean numberos ni guiones (tal vez)
// para llamar a otro metodo q le diga al usuario que esta mal

$(document).ready(function(){
    // Open modal window
    $('#buttonAdd').click(function(){
        $('#myModal').modal('show');
      });

    // Close modal window
    var modal = $('#myModal');
    var closeButton = $('.modal-close')
    closeButton.on('click',function(){
        modal.modal('hide');
    })
    // Close modal window with esc key
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
          $('#myModal').modal('hide');
        }
      });

    // Insert to database 
    $('#buttonInsert').click(function(){
        var first_name = $('#first-name').val();
        var last_name = $('#last-name').val();
        var phone1 = $('#phone1').val();
        var phone2 = $('#phone2').val();
        var phone3 = $('#phone3').val();
        var phone_number = phone1 + '-' + phone2 + '-' + phone3;
        console.log(phone1,phone2,phone3,first_name,last_name);
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
                $('#phone1').val('');
                $('#phone2').val('');
                $('#phone3').val('');
                modal.modal('hide');
                location.reload();
            },
            error: function(xhr, status, error){
                console.log(xhr.responseText);  
            }
        });
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
                var newContact = $('<div class="data" id="'+ contact.phone_number + '">' +
                                        '<div class="data-content">'+
                                            '<h3 class="name">' + 
                                                contact.first_name + ' ' + contact.last_name +                                                    
                                            '</h3>' +
                                            '<div><i class="bx bxs-phone phone"></i><span>'+ contact.phone_number +'</span></div>' +
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
    $('.delete-box').click(function() {
        var id = $(this).data('id'); 
        $.ajax({
            // url: 'http://localhost:5000/insert' + id,
            // type: 'DELETE',
            success: function(response) {
                console.log(response.message);
                console.log(id);
                // location.reload();
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

});