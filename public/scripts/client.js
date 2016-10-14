$(function () {
  $('.ownerRegistration').on('submit', newOwner);
  $('.petRegistration').on('submit', addPet);
  $('.pet-list').on('click', '.delete', deletePet);
  $('.pet-list').on('click', '.update', updatePet);
  updateDropdown();
  appendTable();
});

function newOwner(event) {
  event.preventDefault();
  var ownerData = $(this).serialize();
  console.log('serialize', ownerData);

  $.ajax({
    type: 'POST',
    url: '/owners',
    data: ownerData,
    success: updateDropdown,
  });
};

function updateDropdown() {
  $.ajax({
    type: 'GET',
    url: '/owners',
    success: function (owners) {
      $('#owners').empty();
      owners.forEach(function (petLover) {
        var fullName = petLover.first_name + ' ' + petLover.last_name;
        var $optionDropdown = $('<option value="' + petLover.id + '">' + fullName + '</option>');
        $optionDropdown.data('id', petLover.id);
        $('#owners').append($optionDropdown);
      });
    },
  });
};

function addPet(event) {
  event.preventDefault();
  console.log($(this));
  var idNumber = $(this).children().children(':selected').attr('value');
  console.log(idNumber);
  var idObject = { name: 'owner_id', value: idNumber };
  var petFormData = $(this).serializeArray();
  petFormData.push(idObject);
  console.log(petFormData);

  $.ajax({
    type: 'POST',
    url: '/pets',
    data: petFormData,
    success: appendTable

  })  ;
};


function appendTable() {
  $('.appendedPets').empty();
  $.ajax({
    type: 'GET',
    url: '/pets',
    success: function (data) {
      console.log(data);
      data.forEach(function (pet) {
        var $form = $('<form></form>');
        var $tr = $('<tr></tr>');
        $form.append('<td><input type="text" id="ownerName" value="' + pet.first_name + ' ' + pet.last_name + '" disabled/></td>');
        $form.append('<td><input type="text" id="petName" value="' + pet.name + '"/></td>');
        $form.append('<td><input type="text" id="petBreed" value="' + pet.breed + '"/></td>');
        $form.append('<td><input type="text" id="petColor" value="' + pet.color + '"/></td>');

        var $button = $('<td><button type="button" class="update">Update!</button></td>');
        $button.data('id', pet.id);
        $form.append($button);

        var $deleteTd = $('<td></td>');
        var $deleteButton = $('<button class="delete">Delete!</button>');
        $deleteButton.data('id', pet.id);
        $deleteTd.append($deleteButton);


        $form.append($deleteTd);

        var $statusButton = $('<td><button class="status">In!</button></td>');
        $statusButton.data('id', pet.id);
        $form.append($statusButton);


        $tr.append($form);
        $('.appendedPets').append($tr);
      });
    }
  });
}

function deletePet(event) {
  event.preventDefault;

  var $petID = $(this).data('id');
  console.log($(this));

  $.ajax({
    type: 'DELETE',
    url: '/pets/' + $petID,
    success: appendTable
  });
}

function updatePet(event) {
  event.preventDefault;
  var $button = $(this);
  var id = $(this).parent().data('id');
  var ownerName = $button.closest('form').children().children('input[type=text]').val();
  var petName = $button.closest('form').children().next().children('input[type=text]').val();
  var petBreed = $button.closest('form').children().next().next().children('input[type=text]').val();
  var petColor = $button.closest('form').children().next().next().next().children('input[type=text], #petName').val();
  var petInfo = { id: id, name: petName, breed: petBreed, color: petColor };
  console.log('formData', petInfo);

  $.ajax({
    type: 'PUT',
    url: '/pets/' + id,
    data: petInfo
  });
};
