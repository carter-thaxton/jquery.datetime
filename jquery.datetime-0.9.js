/**
 * datetime: a jQuery plugin, version: 0.9.2 (2018-06-20)
 * @requires jQuery v1.2.3 or later
 *
 * Datetime is a jQuery plugin that makes it easy to support automatically
 * updating timestamps (e.g. "4 minutes ago", "12:05am", or "Tuesday at 5:02pm").
 *
 * For usage and examples, visit:
 * http://github.com/carter-thaxton/jquery.datetime
 *
 * Inspired by jquery.timeago, by Ryan McGeary.
 * Enhanced to support date formats more appropriate for a local business,
 * especially one that may have night-time business hours beyond midnight,
 * and require display in other timezones.
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2016, Carter Thaxton (carter.thaxton -[at]- gmail [*dot*] com)
 */
(function($) {
  $.datetime = function(timestamp, opts) {
    if (timestamp instanceof Date) {
      return inWords(timestamp, opts);
    } else if (typeof timestamp === "string") {
      return inWords($.datetime.parse(timestamp), opts);
    } else {
      return inWords($.datetime.extract(timestamp), opts);
    }
  };
  var $d = $.datetime;

  $.extend($d, {
    settings: {
      relativeLimitMinutes: 20,
      businessDateRolloverHour: 0,
      timezoneOffsetMinutes: 0,
      useShortDateNames: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        time: "%h12:%min%ampm",
        today: "at %time",
        thisWeek: "on %day at %time",
        thisYear: "on %day, %month %date",
        future: "on %day, %month %date, %year",
        other: "on %day, %month %date, %year",
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        shortMonthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        numberNames: []
      }
    },
    inWords: function(datetime, opts) {
      var $s = this.settings;
      if (opts) { $s = $.extend(true, {}, $s, opts) }
      var $l = $s.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      var now = new Date();

      // Adjust all times by timezoneOffsetMinutes, if present
      if ($s.timezoneOffsetMinutes) {
        var offsetMillis = $s.timezoneOffsetMinutes * 60000;
        now = new Date(now.getTime() + offsetMillis);
        datetime = new Date(datetime.getTime() + offsetMillis);
      }

      function zeroPad(value, digits) {
        var result = String(value);
        while (result.length < digits) {
          result = '0' + result;
        }
        return result;
      }

      function subRel(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, datetime) : stringOrFunction;
        var value = ($l.numberNames && $l.numberNames[number]) || number;
        return string.replace(/%d/i, value);
      }

      function subAbs(stringOrFunction, datetime, time, day, date, month, year) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(datetime) : stringOrFunction;
        string = string.
          replace(/%time/i, time).
          replace(/%day/i, day).
          replace(/%date/i, date).
          replace(/%month/i, month).
          replace(/%year/i, year);
        return string;
      }

      function subTime(stringOrFunction, datetime, second, minute, hour, hour12, ampm) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(datetime) : stringOrFunction;
        string = string.
          replace(/%sec/i, zeroPad(second, 2)).
          replace(/%min/i, zeroPad(minute, 2)).
          replace(/%hour/i, hour).
          replace(/%h12/i, hour12).
          replace(/%ampm/i, ampm);
        return string;
      }

      function businessDate(datetime) {
        var d = new Date(datetime);
        d.setHours(0,0,0,0);
        if ($s.businessDateRolloverHour) {
          if (datetime.getHours() < $s.businessDateRolloverHour) {
            d.setDate(d.getDate() - 1);
          }
        }
        return d;
      }

      var millisDiff = now.getTime() - datetime.getTime();
      var future = false;
      if (millisDiff < 0) {
        future = true;
        prefix = $l.prefixFromNow;
        suffix = $l.suffixFromNow;
      }
      millisDiff = Math.abs(millisDiff);

      var secondsDiff = millisDiff / 1000;
      var minutesDiff = secondsDiff / 60;
      var hoursDiff = minutesDiff / 60;
      var daysDiff = hoursDiff / 24;
      var yearsDiff = daysDiff / 365;

      var result;
      var useRelative = ($s.relativeLimitMinutes) && (minutesDiff <= $s.relativeLimitMinutes);

      if (useRelative) {
        var words = secondsDiff < 45 && subRel($l.seconds, Math.round(secondsDiff)) ||
          secondsDiff < 90 && subRel($l.minute, 1) ||
          minutesDiff < 45 && subRel($l.minutes, Math.round(minutesDiff)) ||
          minutesDiff < 90 && subRel($l.hour, 1) ||
          hoursDiff < 24 && subRel($l.hours, Math.round(hoursDiff)) ||
          hoursDiff < 48 && subRel($l.day, 1) ||
          daysDiff < 30 && subRel($l.days, Math.floor(daysDiff)) ||
          daysDiff < 60 && subRel($l.month, 1) ||
          daysDiff < 365 && subRel($l.months, Math.floor(daysDiff / 30)) ||
          yearsDiff < 2 && subRel($l.year, 1) ||
          subRel($l.years, Math.floor(yearsDiff));

          result = $.trim([prefix, words, suffix].join(" "));
      } else {
        var second = datetime.getSeconds();
        var minute = datetime.getMinutes();
        var hour = datetime.getHours();
        var hour12 = (hour > 12) ? (hour-12) : ((hour == 0) ? 12 : hour);
        var ampm = (hour >= 12) ? "pm" : "am";

        var time = subTime($l.time, datetime, second, minute, hour, hour12, ampm);

        var bdate = businessDate(datetime);
        var today = businessDate(now);

        var dayNames = $s.useShortDateNames ? $l.shortDayNames : $l.dayNames;
        var monthNames = $s.useShortDateNames ? $l.shortMonthNames : $l.monthNames;

        var day = dayNames[bdate.getDay()];
        var date = bdate.getDate();
        var month = monthNames[bdate.getMonth()];
        var year = bdate.getFullYear();

        var daysMillis = 1000 * 60 * 60 * 24;

        var pattern;
        if (bdate.getTime() === today.getTime()) {
          pattern = $l.today;
        } else if (bdate.getTime() > today.getTime()) {
          pattern = $l.future;
        } else if (bdate.getTime() >= (today.getTime() - 6 * daysMillis)) {
          pattern = $l.thisWeek;
        } else if (bdate.getFullYear() == today.getFullYear()) {
          pattern = $l.thisYear;
        } else {
          pattern = $l.other;
        }

        result = subAbs(pattern, datetime, time, day, date, month, year);
      }

      return result;
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    extract: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
      var iso8601 = isTime ? $(elem).attr("datetime") : $(elem).attr("title");
      return $d.parse(iso8601);
    }
  });

  $.fn.datetime = function() {
    var self = this;
    self.each(refresh);
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    result = { datetime: $d.extract(element) };
    element.data("datetime", result);
    return result;
  }

  function inWords(date, opts) {
    return $d.inWords(date, opts);
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));
