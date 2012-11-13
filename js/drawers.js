jQuery.fn.selectText = function(){
    var doc = document
        , element = this[0]
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

var refresh = function() {};
var dwrClick = function() {};
var currentDrawer = null;
$(function() {
  refresh = function($drawers) {
    var contents = $drawers.children('.dwr-content');
    var width = 0;
    if ($drawers.is('.active')) {
      width = contents.children().outerWidth();
      contents.contents().first()
      .parents('.dwr-content').each(function() {
        var $content = $(this);
        if ($content.parent('.drawers.active, .drawers:active').size()) {
          $content.css('width', $content.width() + width);
          $content.selectText();
        } else {
          return false;
        }
      });
    } else {
      width = contents.width();
      contents
      .css('width', 0)
      .parents('.dwr-content').each(function() {
        var $content = $(this);
        if ($content.parent('.drawers.active, .drawers:active').size()) {
          $content.css('width', $content.width() - width);
        } else {
          return false;
        }
      });
    }
  };
  $('.drawers').each(function(){
    refresh($(this));
  });
  $('.drawers').click(dwrClick = function(){
    var $drawers = $(this);
    if (!$drawers.is('.disabled, [disabled]')) {
      refresh($drawers.toggleClass('active'));
      if ($drawers.is('.active')) {
        currentDrawer = $drawers;
      } else {
        currentDrawer = null;
      }
    }
    return false;
  });
});

$(document).keyup(function(event) {
  if (event.ctrlKey && event.which == 67 && currentDrawer) {
    currentDrawer.click();
    currentDrawer = null;
  }
});
