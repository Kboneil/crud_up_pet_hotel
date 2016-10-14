$(function () {
  $('.ownerRegistration').on('submit', newOwner);
  $('.petRegistration').on('submit', addPet);
  updateDropdown();
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
        var $optionDropdown = $('<option value="' + fullName + '"></option>');
        $optionDropdown.data('id', petLover.id);
        $('#owners').append($optionDropdown);
      });
    },
  });
};

function addPet(event) {
  event.preventDefault();

  var idNumber = $(this).children('input[name=owner_id] :selected');
  console.log(idNumber);
  // var petData = 3;


  // $.ajax({
  //   type: 'POST',
  //   url: '/pets',
  //   data
  // })
};
