multiselectable.js
==================

jQuery plugin enabling multi-selection of table rows.

([Demo](https://rawgithub.com/macu/multiselectable.js/master/demo/index.html))

Usage
-----

Apply to the `table` or `tbody` containing the selectable rows:

    $("table").multiselectable();
    // or
    $("tbody").multiselectable();

### Options

The `markSelected` and `markUnselected` options define functions to call when the selection changes.

    $("table").multiselectable({

        markSelected: function($row) {
            $row.css("background-color", "yellow");
        },

        markUnselected: function($row) {
            $row.css("background-color", "white");
        }

    });

You may provide a callback function that receives a jQuery set of currently selected rows whenever the selection changes. The individual rows are marked before the callback is invoked.

    $("table").multiselectable({}, function($selectedRows) {
        alert($selectedRows.size() + " rows selected.");
    });
