$(document).ready(function(){
    // Global variables
    var modalInsert = $('#modalInsert');
    var modalEdit = $('#modalEdit');
    var modalDelete = $('#modalDelete');
    var closeButton = $('.modal-close');

////////////   INSERT MODAL    ////////////////
    // Open INSERT modal window
    $('#buttonAdd').on('click', function(){
        $(modalInsert).modal('show');
        $('#first-name').focus();
        console.log('Modal Insert Working');
    });
    // Close INSERT modal window
    closeButton.on('click',function(){
        modalInsert.modal('hide');
        $('#first-name').val('');
        $('#last-name').val('');
        $('#phone1').val('');
        $('#phone2').val('');
        $('#phone3').val('');
    })
    // Close INSERT modal window with esc key
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
          $(modalInsert).modal('hide');
          $('#first-name').val('');
          $('#last-name').val('');
          $('#phone1').val('');
          $('#phone2').val('');
          $('#phone3').val('');
        }
      });

    // INSERT to database 
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
                console.log('hola', response);
                modalInsert.modal('hide');
                location.reload();
            },
            error: function(xhr, status, error){
                var errorJSON = xhr.responseJSON;
                var errorMsg = errorJSON.message.trim();
                console.log(errorMsg);

                if (errorMsg.includes('Error 1')) {
                    // set the input's border color to red
                    $('#first-name').css({
                        'border-color': '#dc3545',
                        'box-shadow': '0 0 0 0.25rem #dc35452e'
                      });
                } 
                if (errorMsg.includes('Error 2')) {
                    // set the input's border color to red
                    $('#last-name').css({
                        'border-color': '#dc3545',
                        'box-shadow': '0 0 0 0.25rem #dc35452e'
                      });
                }
                if (errorMsg.includes('Error 3')) {
                    // set the input's border color to red
                    $('.phone-error').css({
                        'border-color': '#dc3545',
                        'box-shadow': '0 0 0 0.25rem #dc35452e'
                      });
                    console.log('pintado tel')
                }
            }
        });
    }

    $('#buttonInsert').click(function(){
        $('.form-control').removeAttr('style');
        insert();
    });
    $('#modalInsert input').keypress(function(e) {
        $('.form-control').removeAttr('style');

        if (e.which == 13) { 
          insert(); 
          return false; 
        }
    });

    // DYNAMIC LIST
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
                                            '<span class="first_name">'+ contact.first_name +'</span>'+
                                            '<span>'+' '+'</span>'+
                                            '<span class="last_name">'+ contact.last_name +'</span>'+                                               
                                            '</h3>' +
                                            '<div><i class="bx bxs-phone phone"></i><span class="number">'+ contact.phone_number +'</span></div>' +
                                        '</div>' + 
                                        '<div class="edit-container">' +
                                            '<button type="button" data-toggle="modal" data-target="#modalEdit" class="buttonEdit" ><i class="bx bxs-edit edit"></i></button>' +
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

////////////   UPDATE MODAL    ////////////////
    // To display modal
    $('#contacts-container').on('click', '.buttonEdit', function() {
        // Open EDIT modal window
        var contact_id = $(this).parents('.data').attr('id');
        var updateFn = update(contact_id);
        var data = $(this).parents('.data');
        var first_name = data.find('.first_name').text();
        var last_name = data.find('.last_name').text();
        var phone = data.find('.number').text();
        const regex = /(\w{3})-(\w{3})-(\w{4})/;
        var phone1 = phone.match(regex)[1];
        var phone2 = phone.match(regex)[2];
        var phone3 = phone.match(regex)[3];
        $(modalEdit).modal('show');
        $('#first-name-update').val(first_name);
        $('#last-name-update').val(last_name);   
        $('#phone1-update').val(phone1);
        $('#phone2-update').val(phone2);
        $('#phone3-update').val(phone3);     
        console.log(contact_id,first_name,last_name);
        
        // Event handler for the updated query
        
        $('#buttonUpdate').off('click');
        $('#buttonUpdate').off('keypress');
        $('#buttonUpdate').on('click', updateFn);
        $(document).on('keypress', function(e) {
            if ((e.keyCode == 13) && $('#modalEdit input').is(':focus')) {
                e.preventDefault(); // prevent form submission
                updateFn();
            }
        })        
        // Close EDIT modal window
        closeButton.on('click', function(){
            $('.form-control').removeAttr('style');
            modalEdit.modal('hide');
            $('#first-name-update').val('');
            $('#last-name-update').val('');
            $('#phone1-update').val('');
            $('#phone2-update').val('');
            $('#phone3-update').val('');
        })
        // Close EDIT modal window with esc key
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
            $('.form-control').removeAttr('style');
            $(modalEdit).modal('hide');
            $('#first-name-update').val('');
            $('#last-name-update').val('');
            $('#phone1-update').val('');
            $('#phone2-update').val('');
            $('#phone3-update').val('');
            }
        });
    });   
    // To conect with Flask
    function update(contact_id) {
        return function() {
            $('.form-control').removeAttr('style');
            console.log(contact_id)
            var first_name = $('#first-name-update').val();
            var last_name = $('#last-name-update').val();
            var phone1 = $('#phone1-update').val();
            var phone2 = $('#phone2-update').val();
            var phone3 = $('#phone3-update').val();
            var phone_number = phone1 + '-' + phone2 + '-' + phone3;
            $.ajax({
                type: 'PUT',
                url: "http://localhost:5000/update",
                data: JSON.stringify({
                    "first_name": first_name,
                    "last_name": last_name,
                    "phone_number": phone_number,
                    "contact_id": contact_id
                }),
                dataType: "json",
                contentType: "application/json",
                success: function(response) {
                    console.log(response.message);
                    console.log(contact_id);        
                    location.reload();        
                },
                error: function(xhr, status, error){
                    console.log(xhr.responseText);
                    var errorJSON = xhr.responseJSON;
                    var errorMsg = errorJSON.message.trim();
                    console.log(errorMsg);
    
                    if (errorMsg.includes('Error 1')) {
                        // set the input's border color to red
                        $('#first-name-update').css({
                            'border-color': '#dc3545',
                            'box-shadow': '0 0 0 0.25rem #dc35452e'
                          });
                    } 
                    if (errorMsg.includes('Error 2')) {
                        // set the input's border color to red
                        $('#last-name-update').css({
                            'border-color': '#dc3545',
                            'box-shadow': '0 0 0 0.25rem #dc35452e'
                          });
                    }
                    if (errorMsg.includes('Error 3')) {
                        // set the input's border color to red
                        $('.phone-error').css({
                            'border-color': '#dc3545',
                            'box-shadow': '0 0 0 0.25rem #dc35452e'
                          });
                        console.log('pintado tel')
                    }  
                }
            });
        };            
    }
//////////   END UPDATE MODAL    //////////////

////////////   DELETE MODAL    ////////////////
    $('#contacts-container').on('click', '.delete-box',function() {
        var id = $(this).closest('.data').attr('id'); 
        var deleteFn = delete_contact(id);
        $(modalDelete).modal('show');
        console.log('Modal Delete Working',id);
        
        $('#buttonDelete').off('click');
        $('#buttonDelete').on('click', deleteFn);

        // Close DELETE modal 
        closeButton.on('click', function(){
            modalDelete.modal('hide');
        })
        // Close DELETE modal window with esc key
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
            $(modalDelete).modal('hide');
            }
        });
    });
    function delete_contact(id) {
        return function(){
            $.ajax({
                url: 'http://localhost:5000/delete/' + id,
                type: 'DELETE',
                success: function(response) {
                    console.log(response.message);
                    console.log(id);
                    $('#'+ id).remove();
                    $(modalDelete).modal('hide');
                },
                error: function(xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });

        }
    }
//////////   END DELETE MODAL    //////////////

    // SEARCH from the dynamic list
    function quitAccents (str){
        str = str.replace(/[áàâä]/gi, 'a')
        .replace(/[éèêë]/gi, 'e')
        .replace(/[íìîï]/gi, 'i')
        .replace(/[óòôö]/gi, 'o')
        .replace(/[úùûü]/gi, 'u')
        .replace(/[ñ]/gi, 'n')
        .replace(/[ç]/gi, 'c');
        return str
    }

    function homogeneousNumbers (n){
        n = n.replace(/([0-9]{3})(?:-)([0-9]{3})(?:-)([0-9]{4})/g, '$1$2$3')
        .replace(/([0-9]{3})(?:-)([0-9]{3})(?:-)/g, '$1$2')
        .replace(/([0-9]{3})(?:-)([0-9]{3})/g, '$1$2')
        .replace(/([0-9]{3})(?:-)/g, '$1')
        .replace(/([0-9]{3})/g, '$1');
        return n
    }

    function searchContacts() {
        var searchQuery = $('#search-bar').val().toLowerCase();
        searchQuery = quitAccents(searchQuery);
        searchQuery = homogeneousNumbers(searchQuery);
        $('#contacts-container .data').each(function() {
          var first_name = $(this).find('.first_name').text().toLowerCase();
          var last_name = $(this).find('.last_name').text().toLowerCase();
          var phone_number = $(this).find('.number').text().toLowerCase();
          first_name = quitAccents(first_name);
          last_name = quitAccents(last_name);
          phone_number = homogeneousNumbers(phone_number);
          console.log(searchQuery);

          if (first_name.indexOf(searchQuery) !== -1 || last_name.indexOf(searchQuery) !== -1 || phone_number.indexOf(searchQuery) !== -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }  
    
    $('#search-bar').on('input',function(){
        searchContacts();
    });

    // $(document).on('submit', 'form', function(e) {
    //     e.preventDefault();
    //     searchContacts();
    // });

    // $(document).on('keydown', function(e) {
    //     if ((e.keyCode == 13) && $('#search-bar').is(':focus')){
    //       searchContacts();
    //     }
    //   });
      
    
    

//////////////    END OF THE FILE    ///////////////////////
});