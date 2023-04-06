$(document).ready(function(){
////////////   INSERT MODAL    ////////////////
    // Open INSERT modal window
    $('#buttonAdd').click(function(){
        $('#modalInsert').modal('show');
        console.log('Modal Insert Working');
      });
    // Close INSERT modal window
    var modalInsert = $('#modalInsert');
    var closeButton = $('.modal-close-insert')
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
          $('#modalInsert').modal('hide');
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
                console.log(response);
                modalInsert.modal('hide');
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

    // DELETE row 
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
////////////   UPDATE MODAL    ////////////////
    // To display modal
    $('#contacts-container').on('click', '.buttonEdit', function() {
        // Open EDIT modal window
        var contact_id = $(this).parents('.data').attr('id');
        var data = $(this).parents('.data');
        var first_name = data.find('.first_name').text();
        var last_name = data.find('.last_name').text();
        var phone = data.find('.number').text();
        const regex = /(\w{3})-(\w{3})-(\w{4})/;
        var phone1 = phone.match(regex)[1];
        var phone2 = phone.match(regex)[2];
        var phone3 = phone.match(regex)[3];
        $('#modalEdit').modal('show');
        $('#first-name-update').val(first_name);
        $('#last-name-update').val(last_name);   
        $('#phone1-update').val(phone1);
        $('#phone2-update').val(phone2);
        $('#phone3-update').val(phone3);     
        console.log(contact_id,first_name,last_name);
        // To connect with Flask
        function update(contact_id) {
            return function() {
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
                    }
                });
            };            
        }
        $('#buttonUpdate').off('click');
        $('#buttonUpdate').on('click', update(contact_id));

        // Close EDIT modal window
        var modalInsert = $('#modalEdit');
        var closeButton = $('.modal-close-edit')
        closeButton.on('click',function(){
            modalInsert.modal('hide');
            $('#first-name-update').val('');
            $('#last-name-update').val('');
            $('#phone1-update').val('');
            $('#phone2-update').val('');
            $('#phone3-update').val('');
        })
        // Close EDIT modal window with esc key
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
            $('#modalEdit').modal('hide');
            $('#first-name-update').val('');
            $('#last-name-update').val('');
            $('#phone1-update').val('');
            $('#phone2-update').val('');
            $('#phone3-update').val('');
            }
        });
    });   
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

    function searchContacts() {
        var searchQuery = $('#search-bar').val().toLowerCase();
        $('#contacts-container .data').each(function() {
          var first_name = $(this).find('.first_name').text().toLowerCase();
          var last_name = $(this).find('.last_name').text().toLowerCase();
          var phone_number = $(this).find('.number').text().toLowerCase();
          first_name = quitAccents(first_name);
          last_name = quitAccents(last_name);

          if (first_name.indexOf(searchQuery) !== -1 || last_name.indexOf(searchQuery) !== -1 || phone_number.indexOf(searchQuery) !== -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }  

    $(document).on('submit', 'form', function(e) {
        e.preventDefault();
        searchContacts();
    });

    $(document).on('keydown', function(e) {
        if ((e.keyCode == 13) && $('#search-bar').is(':focus')){
          searchContacts();
        }
      });
      
    
    

//////////////    END OF THE FILE    ///////////////////////
});