/* ==========================================================
 * bootstrap-drawers.js v2.2.1
 * ==========================================================
 * Copyright 2012 Phiware
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* DRAWERS CLASS DEFINITION
  * ====================== */

  var currentCopier = null
    , activeSel = '.drawers.active, .drawers:active'
    , Drawers = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.drawers.defaults, options)

        if (this.options.nestables)
          this.options.nestables += ',.drawers'
        else
          this.options.nestables = '.drawers'
        this.options.nestables = this.options.nestables
          + ',a'
          + ',.btn'
          + ',[role="button"]'
          + ',[data-dismiss]'
          + ',[data-toggle]'
          + ',button'
          + ',input'
          + ',textarea'
          + ',select'
          + ',form'
          + ',video'
          + ',audio'

        this.init()
      }

  Drawers.prototype = {

    constructor: Drawers

  , actions: {

      init: function () {
        var dim = this.dimension() == 'vertical' ? 'height' : 'width'
          , contents = this.$element.children('.dwr-content').first()
          , size = this.active() ? this.contentSize() : 0
        
        contents[dim](size)
        if (!size) contents.hide();
      }

    , show: function () {
        this.$element.children('.dwr-content').first().show()
        var size = this.contentSize()

        if ($.fn.selectText) {
          this.$element.children('.dwr-content').first()
            .find(this.options.copier).first()
            .selectText()
          
          currentCopier = this.$element
        }

        this.transition(size, $.Event('show'), 'shown')
      }

    , hide: function () {
        var size = this.contentSize()
          , drawers = this

        this.transition(-size, $.Event('hide'), 'hidden')
      }

    , toggle: function () {
        if (this.$element.is(activeSel)) {
          this.hide()
        } else {
          this.show()
        }
      }

    }

  , active: function () {
      if (arguments.length == 1) {
        if (arguments[0]) {
          this.show()
        } else {
          this.hide()
        }
        return this
      }
      return this.$element.is(activeSel)
    }

  , disabled: function () {
      if (arguments.length == 1) {
        if (arguments[0]) {
          this.$element.addClass('disabled')
        } else {
          this.$element.removeClass('disabled')
          this.$element.removeAttr('disabled')
        }
        return this
      }
      return this.$element.is('.disabled, [disabled]')
    }

  , targetedBy: function (e) {
      return !$('.dwr-content', this.$element).children().is($(e.target).parents())
          || this.$element.is($(e.target))
          || ($(e.target).is(this.options.nestables)
              ? false
              : this.$element.is($(e.target).parents(this.options.nestables).first()))
    }

  , dimension: function () {
      return this.$element.is('.drawers-vertical') ? 'vertical' : 'horizontal';
    }

  , size: function () {
      if (this.dimension() == 'vertical') {
        return this.$element[0].scrollHeight
      } else {
        return this.$element[0].scrollWidth
      }
    }

  , contentSize: function () {
      var contents = this.$element.children('.dwr-content')
      if (this.dimension() == 'vertical') {
        return contents[0].scrollHeight
      } else {
        return contents[0].scrollWidth
      }
    }

  , transition: function (offset, eventObject, complete) {
      var drawers = this
        , onComplete = function () {
            if (eventObject.type == 'hide') {
              drawers.$element.removeClass('active');
              if (dim == 'width')
                contents.hide()
            }

            drawers.transitioning = 0
            if (typeof complete == 'string') {
              drawers.$element.trigger(complete)
            } else {
              complete.call(drawers)
            }
          }
        , dim = this.dimension() == 'vertical' ? 'height' : 'width'
        , contents = this.$element.children('.dwr-content').first()

      this.$element.trigger(eventObject)
      if (eventObject.isDefaultPrevented()) return

      this.transitioning = 1

      var size = contents[dim]() + offset
      if (size <= 0 && dim == 'width') size = 1;
      contents[dim](size)

      if (eventObject.type == 'show')
        this.$element.addClass('active');

      contents.parents('.dwr-content')
        .each(function () {
          var $content = $(this)
          if ($content.parent(activeSel).size()) {
            $content[dim]($content[dim]() + offset)
          } else {
            return false
          }
        })

      if ($.support.transition) {
        this.$element.one($.support.transition.end, onComplete)
      } else {
        complete()
      }
    }

  }

  $.extend(Drawers.prototype, Drawers.prototype.actions)


 /* DRAWERS PLUGIN DEFINITION
  * ======================= */

  $.fn.reverse = Array.prototype.reverse

  $.fn.drawers = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('drawers')
        , options = typeof option == 'object' && option
      if (!data) $this.data('drawers', (data = new Drawers(this, options)))
      if (typeof option == 'string') data.actions[option].call(data)
    })
  }

  $.extend($.fn.drawers, {

    defaults: {
      copier: '.copy-drawer'
    }

  , click: function (e) {
      var $element = $(this)
        , drawers = $element.data('drawers')
      if (!drawers.disabled() && drawers.targetedBy(e)) {
        drawers.toggle()
      }
      e.preventDefault()
    }

  , keypress: function (e) {
    console.log(e)
      if (currentCopier && e.which == 67
          && (e.ctrlKey || e.metaKey)
      ) {
        currentCopier.click()
        currentCopier = null
      }
    }

  , Constructor: Drawers

  })


 /* DRAWERS DATA-API
  * ============== */

  $(window)
    .on('load', function () {
      $('.drawers')
        .reverse()
        .each(function () {
          var $dwr = $(this)
            , data = $dwr.data()

          $dwr.drawers(data)
        })
    })
  $(document)
    .on('keyup.drawers.data-api keydown.drawers.data-api', $.fn.drawers.keypress)
    .on('click.drawers.data-api touchstart.drawers.data-api'
      , '.drawers'
      , $.fn.drawers.click)

}(window.jQuery);
