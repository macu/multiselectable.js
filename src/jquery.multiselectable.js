/*!
 * Multiselectable jQuery plugin v0.1.2
 * https://github.com/macu/multiselectable.js
 *
 * Copyright (c) 2013 Matt Cudmore
 * Released under the MIT license
 */
(function() {

	$.fn.multiselectable = function(options, cb) {

		var defaults = {

			// the function to mark a row as selected
			markSelected: function($row) {
				$row.addClass("selected");
			},

			// the function to mark a row as unselected
			markUnselected: function($row) {
				$row.removeClass("selected");
			}

		};

		var settings = $.extend({}, defaults, options);

		var $selectableRows = $(this).is("tr")
			? $(this)
			: $(this).find("tr");

		// disable text selection on rows
		// so that shift+click doesn't select text
		$selectableRows
			.attr('unselectable', 'on')
			.css('user-select', 'none')
			.on('selectstart', false);

		var $selectedRows = $();
		var $startRow;

		$selectableRows.on("click", function(e) {

			var $thisRow = $(this);

			if (!(e.shiftKey || e.ctrlKey)) {
				// reset to single selection
				$startRow = $thisRow;
				setSelected($thisRow);
				callback();
				return;
			}

			if (!$startRow) {
				// start at this row if not another
				$startRow = $thisRow;
			}

			// get the current range of rows
			var $thisRange;
			if (e.shiftKey) {
				// consider multiple rows since start row
				var prevIndex = $startRow.index();
				var thisIndex = $thisRow.index();
				// exclude start row if ctrl+shift+click
				// (leave it unchanged on toggle range)
				var ctrl = e.ctrlKey ? 1 : 0;
				// get range
				if (prevIndex < thisIndex) {
					// add 1 to include this row
					$thisRange = $selectableRows.slice(prevIndex + ctrl, thisIndex + 1);
				} else {
					// add 1 to include start row
					$thisRange = $selectableRows.slice(thisIndex, prevIndex + 1 - ctrl);
				}
			} else {
				// consider single row
				$thisRange = $thisRow;
				// reset start row for next time
				$startRow = $thisRow;
			}

			if (e.ctrlKey) {
				// toggle selection across range
				togSelected($thisRange);
			} else {
				// set selection across range
				setSelected($thisRange);
			}

			callback();

		});

		function setSelected($rows) {
			// mark all unselected
			$selectedRows.each(markUnselected);
			// set selected to given rows
			$selectedRows = $rows;
			// mark all selected
			$selectedRows.each(markSelected);
		}

		function togSelected($rows) {
			$rows.each(function() {
				if ($selectedRows.is($(this))) {
					$selectedRows = $selectedRows.not($(this));
					markUnselected($(this));
				} else {
					$selectedRows = $selectedRows.add($(this));
					markSelected($(this));
				}
			});
		}

		function markSelected($row) {
			if (!($row instanceof jQuery)) $row = $(this);
			if (typeof settings.markSelected == "function") {
				settings.markSelected($row);
			}
		}

		function markUnselected($row) {
			if (!($row instanceof jQuery)) $row = $(this);
			if (typeof settings.markUnselected == "function") {
				settings.markUnselected($row);
			}
		}

		function callback() {
			if (typeof cb == "function") {
				cb($selectedRows);
			}
		}

	};

})(jQuery);
