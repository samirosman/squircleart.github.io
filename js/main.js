// Show Prerequisite
function showPrerequisites() {
    var x = document.getElementById('prerequisites');
    var style = window.getComputedStyle(x);
    var display = style.getPropertyValue('display');

    if (display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

// Static comments
jQuery(document).ready(function ($) {
  var $comments = $('.js-comments');

  $('#comment-form').submit(function () {
    var form = this;

    $(form).addClass('submitting');
    $('#comment-form-submit').html('Loading ...');

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      contentType: 'application/x-www-form-urlencoded',
      success: function (data) {
        $('#comment-form-submit').html('Submitted');
        $('.new-comment-form .js-notice').removeClass('notice--danger').addClass('notice--success');
        showAlert('<p style="color:#47bd40">Thanks for your comment! It will show on the site once it has been approved.</p>');
      },
      error: function (err) {
        console.log(err);
        $('#comment-form-submit').html('Submit Comment');
        $('.new-comment-form .js-notice').removeClass('notice--success').addClass('notice--danger');
        showAlert('<p style="color:#e64848">Submission failed, please fill in all the required inputs.</p>');
        $(form).removeClass('submitting');
      }
    });

    return false;

  });

  function showAlert(message) {
    $('.new-comment-form .js-notice').removeClass('hidden');
    $('.new-comment-form .js-notice-text').html(message);
  }
});
