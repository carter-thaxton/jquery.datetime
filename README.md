jquery.datetime
===============

jquery.datetime is a jquery plugin that automatically renders human-readable date-times, using simple embedded ISO8601 dates in HTML or DOM elements.

The library naturally determines whether the time is recent enough or near enough in the future to use relative times, like "3 minutes ago" or "4 minutes from now".  Beyond that, it uses heuristics to display only as much information as is relvant.  For example, on the same day, it shows the time and doesn't bother displaying the date, like "2:45pm".  On other days of the same week, it will show the day and time, but not the day, like "on Monday at 4:55pm".  Beyond these timescales, it shows just the date, and doesn't bother with the time, and only displays the year when relevant.


Kudos
-----
This project was inspired by [jquery.timeago](http://timeago.yarp.com/), written by by Ryan McGeary.


Examples
--------

Simply use `abbr` or `time` elements in your HTML, with an appropriate datetime string (e.g. ISO8601).

    <abbr title="2011-05-13T20:16:40.748Z"/>

or

    <time datetime="2011-05-13T20:16:40.748Z"/>


Then in your script, make sure to include both the jquery.datetime library, as well as jquery itself.

    <script src="/jquery-1.6.1.min.js" type="text/javascript"></script>
    <script src="/jquery.datetime-0.9.js" type="text/javascript"></script>


On DOM ready, run `datetime()` on any `abbr` or `time` elements that you wish to convert.
Here's an example:

    <script type="text/javascript">
      $(function() {
        $("time").datetime();
      });
    </script>

This will set the text of these elements to something human-readable.
You may wish to update these every minute, so they remain accurate on a page that's open for a long time.


Business Date
-------------

One of the features of jquery.datetime is to avoid displaying the date for times that are on the same day.  jquery.datetime was created for a business that has hours after midnight, so 1:55am is really the 'same day' as 11:55pm, 2 hours before, for most purposes.  There is a setting called `businessDateRolloverHour`, which may be set to 4 to mean that times until 4:00am are considered the same day for purposes of determining whether to provide the day for additional context.


Details
-------

- When the time is recent or in the near future, by default within 20 minutes, it will use relative formatting like "3 minutes ago" or "4 minutes from now".

- When on the same day, it uses a simple time format like "at 4:13pm".  This incorporates the notion of business date, described above.

- When it's another day in the past week, it will display as "on Monday at 2:11pm".

- When it's in the same year, it formats as "on Thursday, February 13"

- When it's in another year, it will show as "on Wednesday, March 8, 2009"


Settings
--------

- *relativeLimitMinutes*      (default 20, show relative times within a window of 20 minutes)
- *businessDateRolloverHour*  (default 0, rollover at midnight.  Set this to 4 to rollover at 4am)
- *useShortDateNames*         (default false, set to true to use *Wed* and *Mar* instead of *Wednesday* and *March*)

Set any of the above from javascript as follows:

    $.datetime.settings.useShortDateNames = true;
    $.datetime.settings.businessDateRolloverHour = 4;


Internationalization
--------------------

All strings used by jquery.datetime are configurable.  To modify the language or the date format, set any of the strings.

For example, to say '5 minutes in the past' instead of '5 minutes ago', use:

    $.datetime.settings.strings.suffixAgo = 'in the past';

Also, you can set the words to use for numbers, e.g.

    $.datetime.settings.strings.numberWords = ['zero', 'one', 'two', 'three', 'four'];

That will produce 'two minutes ago' instead of '2 minutes ago', but will still say '5 minutes ago', because a word for 5 was not provided.


