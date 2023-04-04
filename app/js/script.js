//Cambiar lo de abajo para enlazarlo con frontend para q se llame cuando un boton haga click onClick event handler
// validar el telefono sea de 12 digitos y que no contenga caracteres que no sean numberos ni guiones (tal vez)
// para llamar a otro metodo q le diga al usuario que esta mal

$(document).ready(function(){
    // Open modal window
    $('.button-card').click(function(){
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
    $('#button1').click(function(){
        var first_name = $('#first_name').val();
        var last_name = $('#last_name').val();
        var phone1 = $('#phone1').val();
        var phone2 = $('#phone2').val();
        var phone3 = $('#phone3').val();
        var phone_number = phone1 + '-' + phone2 + '-' + phone3;
        
        $.ajax({
            type: "POST",
            url: "/insert",
            data: JSON.stringify({
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number
            }),
            dataType: "json",
            contentType: "application/json",
            success: function(response){
                console.log(response);
            },
            error: function(xhr, status, error){
                console.log(xhr.responseText);
            }
        });
    });

    // Delete row 
    $('.delete-box').click(function() {
        var id = 123; // specify the ID of the row to delete
        $.ajax({
            url: '/delete/' + id,
            type: 'DELETE',
            success: function(response) {
                console.log(response.message);
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

});