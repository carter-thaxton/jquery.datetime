jquery.datetime
===============

jquery.datetime is a jquery plugin that automatically renders human-readable date-times, using simple embedded ISO8601 dates in HTML or DOM elements.

The library naturally determines whether the time is recent enough or near enough in the future to use relative times, like "3 minutes ago" or "4 minutes from now".  Beyond that, it uses heuristics to display only as much information as is relvant.  For example, on the same day, it shows the time and doesn't bother displaying the date, like "2:45pm".  On other days of the same week, it will show the day and time, but not the day, like "on Monday at 4:55pm".  Beyond these timescales, it shows just the date, and doesn't bother with the time, and only displays the year when relevant.

Details
-------

- When the time is recent or in the near future, by default within 20 minutes, it will use relative formatting like "3 minutes ago" or "4 minutes from now".

- When on the same day, it uses a simple time format like "at 4:13pm".

- When it's another day in the past week, it will display as "on Monday at 2:11pm".

- When it's in the same year, it formats as "on Thursday, February 13"

- When it's in another year, it will show as "on Wednesday, March 8, 2009"


Examples
--------

    <script src="/jquery-1.6.1.min.js" type="text/javascript"></script>
    <script src="/jquery.datetime-0.9.js" type="text/javascript"></script>

    <script type="text/javascript">
      $(function() {
        $("time").datetime();
      });
    </script>

