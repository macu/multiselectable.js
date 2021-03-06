/*!
 * Multiselectable jQuery plugin v0.1.4-wip
 * https://github.com/macu/multiselectable.js
 *
 * Copyright (c) 2013 Matt Cudmore
 * Released under the MIT license
 */
(function() {

	var defaults = {
		// Updates the UI to mark a row as selected.
		markSelected: function($row) {
			$row.addClass("selected");
		},

		// Updates the UI to mark a row as unselected.
		markUnselected: function($row) {
			$row.removeClass("selected");
		},

		// Selector for elements that consume click events.
		consumers: "a,button,input,select",
	};

	$.fn.multiselectable = function(options, cb) {

		options = $.extend(true, {}, defaults, options);

		var $selectableRows = $(this).is("tr")
			? $(this)
			: $(this).find("tr");

		var $selectedRows = $();
		var $startRow;

		$selectableRows.on("click", function(e) {

			// Ignore click if target consumes events.
			if ($(e.target).is(options.consumers)) {
				return;
			}

			var $thisRow = $(this);
			var rangeSelect = e.shiftKey;
			var toggleSelect = e.ctrlKey || e.altKey || e.metaKey;

			if (!(rangeSelect || toggleSelect)) {
				// Reset to single row selection.
				$startRow = $thisRow;
				setSelected($thisRow);
				callback();
				return;
			}

			if (!$startRow) {
				// Start current range at this row if not before.
				$startRow = $thisRow;
			}

			// Get the current range of rows to update.
			var $thisRange;
			if (rangeSelect) {
				// Update all rows between the start row and this row.
				var prevIndex = $startRow.index();
				var thisIndex = $thisRow.index();
				// Leave the start row unchanged on toggle range.
				var excludeStart = toggleSelect ? 1 : 0;
				if (prevIndex < thisIndex) {
					// This row is at the bottom of the current range.
					// Add 1 to include this row.
					$thisRange = $selectableRows.slice(prevIndex + excludeStart, thisIndex + 1);
				} else {
					// This row is at the top of the current range.
					// Add 1 to include start row.
					$thisRange = $selectableRows.slice(thisIndex, prevIndex + 1 - excludeStart);
				}
			} else {
				// Update a single row.
				$thisRange = $thisRow;
				// Set start row for next range selection.
				$startRow = $thisRow;
			}

			if (toggleSelect) {
				// Toggle selection across current range.
				togSelected($thisRange);
			} else {
				// Set selection across current range.
				setSelected($thisRange);
			}

			callback();

		});

		function setSelected($rows) {
			// Clear the previous selection.
			$selectedRows.each(markUnselected);
			// Set the selection as given.
			$selectedRows = $rows;
			$selectedRows.each(markSelected);
		}

		function togSelected($rows) {
			$rows.each(function() {
				var $row = $(this);
				if ($selectedRows.is($row)) {
					$selectedRows = $selectedRows.not($row);
					markUnselected($row);
				} else {
					$selectedRows = $selectedRows.add($row);
					markSelected($row);
				}
			});
		}

		function markSelected($row) {
			if (!($row instanceof jQuery)) $row = $(this);
			if (typeof options.markSelected == "function") {
				options.markSelected($row);
			}
		}

		function markUnselected($row) {
			if (!($row instanceof jQuery)) $row = $(this);
			if (typeof options.markUnselected == "function") {
				options.markUnselected($row);
			}
		}

		function callback() {
			if (typeof cb == "function") {
				cb($selectedRows);
			}
		}

		// Disable text selection in the selectable rows
		// while the SHIFT key is pressed.
		$(document).on("keydown", function(e) {
			if (e.shiftKey) {
				disableTextSelection($selectableRows);
				var shiftReleased = function(e) {
					if (!e.shiftKey) {
						enableTextSelection($selectableRows);
						$(document).off("keyup", shiftReleased);
					}
				};
				$(document).on("keyup", shiftReleased);
			}
		});

	};

	function disableTextSelection($e) {
		$e.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false);
	}

	function enableTextSelection($e) {
		$e.attr('unselectable', 'off')
			.css('user-select', 'text')
			.off('selectstart');
	}

})(jQuery);
