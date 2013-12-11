multiselectable.js
==================

jQuery plugin enabling multi-selection of table rows.

Usage
-----

Apply to the `table` or `tbody` containing the selectable rows:

    $("table").multiselectable();
    // or
    $("tbody").multiselectable();

### Options

The `markSelected` option defines a function to call for each row that becomes selected.
Likewise `markUnselected` defines a function to call for each row that becomes unselected.

    $("table").multiselectable({

        markSelected: function($row) {
            $row.css("background-color", "yellow");
        },

        markUnselected: function($row) {
            $row.css("background-color", "white");
        }

    });

You may provide a function to call whenever the selection changes.
This function receives a jQuery set of all the selected rows after the individual rows have been marked.

    $("table").multiselectable({}, function($selectedRows) {
        alert($selectedRows.size() + " rows selected.");
    });
