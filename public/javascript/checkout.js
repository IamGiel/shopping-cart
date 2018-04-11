Stripe.setPublishableKey("pk_test_WCFwjEHE73UbF0v5EbVWxhnn"); //we are importing this in our checkout.hbs file at the bottom of the script below the stripe script imports

var $form = $("#checkout-form"); //grabbing our form
$form.submit(function(event) {
  $form.find("#charge-error").addClass("hidden");
  //use the form and find the button and disable it (avoid multiple clicks while validation is going on)
  $("button").prop("disabled", true);
  //paste the stripe boiler plate code, for creating a token
  Stripe.card.createToken(
    {
      number: $("#card-number").val(),
      cvc: $("#card-cvc").val(),
      exp_month: $("#card-expiry-month").val(),
      exp_year: $("#card-expiry-year").val(),
      name: $("#card-name").val() //this is added, the first four inputs are required
    },
    stripeResponseHandler
  );
  return false; //this stops the submit event from submitting and doesn't continue and prevent to submit to the server (we dont want that yet)
});

//boilerplate copied from stripe docs

function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $("#checkout-form"); //match this to your form id

  if (response.error) {
    // Problem!

    // Show the errors on the form
    $form.find("#charge-error").text(response.error.message);
    $form.find("#charge-error").removeClass("hidden");
    $form.find("button").prop("disabled", false); // Re-enable submission
  } else {
    // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}

