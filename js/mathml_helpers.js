/**
 * Created by kevin on 2014-09-01.
 */

function fixNegativeNumbers(elem) {
  $(elem).children().each(function () {
    if (this.tagName === 'MN') {
      var num = this.textContent;
      if (num.indexOf('-') !== -1) {
        num = -parseFloat(num);
        $(this).replaceWith('<mrow class="num"><mo stretchy="false">(</mo><mo>-</mo><mn>' + num + '</mn><mo stretchy="false">)</mo></mrow>');
      }
    }
    fixNegativeNumbers(this);
  });
}

function createFractions(elem) {
  $(elem).children().each(function () {
    if (this.tagName === 'MO') {
      if ($(this).text() === '/') {
        console.log(this);

        var frac = $('<mfrac>').append($(this).prev(), $(this).next());
        $(this).replaceWith(frac);

        stretchyFalse(frac);
      }
    }
    createFractions(this);
  });
}

function formatDivison(elem) {
  $(elem).children().each(function () {
    if (this.tagName === 'MO') {
      // TODO: create a dictionary for these magic values
      if ($(this).text() === '/') {
        $(this).text('\xF7');
      }
      if ($(this).text() === '*') {
        $(this).text('\xD7');
      }
      if ($(this).text() === '-') {
        $(this).text('\u2212');
      }
    }
    formatDivison(this);
  });
}

function stretchyFalse(elem) {
  $(elem).children().each(function () {
    if (this.tagName === 'MO') {
      var text = $(this).text();
      if (text === '(' || text === ')') {
        $(this).attr('stretchy', 'false');
      }
    }
    stretchyFalse(this);
  });
}

// TODO: add a separate function to remove parentheses from denominators

function removeUnnecessaryParentheses(elem) {
  $(elem).children().each(function () {
    var children = $(this).children();
    if (children.length === 3) {
      if (children[0].tagName === 'MO' && $(children[0]).text() === '(' &&
        children[2].tagName === 'MO' && $(children[2]).text() === ')' &&
        children[1].tagName === 'MROW' && $(children[1]).children().length === 1) {
        $(children[0]).remove();
        $(children[2]).remove();
      }
    }
    removeUnnecessaryParentheses(this);
  });
}


function removeUnnecessaryRows(elem) {
  $(elem).children().each(function () {
    var children = $(this).children();

    if ($(this).hasClass('num')) {
      removeUnnecessaryRows(this);
    } else if ($(this).is('mrow') && children.length === 1) {
      $(this).replaceWith(children[0]);
    } else if ($(this).is('mrow') && $(this.firstElementChild).text() === '(' && $(this.lastElementChild).text() === ')') {
      $(this).replaceWith(children);
    } else {
      removeUnnecessaryRows(this);
    }
  });
}
