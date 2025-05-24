
var isDrawing = false;
var color = 'rgb(0, 0, 0)';

var row_input = 24; // width
var col_input = 24; // height

$(document).ready(function () {

	// init
	// --------------------------------------------------------------------------------------------------------

	//build the grid
	for (var i = 1; i <= row_input; i++) {
	  $('table').append("<tr></tr>"); // This loop creates a row of cells

	  for (var j = 1; j <= col_input; j++) {
		$('tr:last').append("<td></td>"); // This loop adds a cell after every row
		$('td').attr("class", 'cells'); // For every 'td', a class of 'cells' is created
	  }

	}

    //reset grid to white
     resetGrid();


	// --------------------------------------------------------------------------------------------------------


	// listeners
	// --------------------------------------------------------------------------------------------------------
	document.getElementById("pixel_canvas").addEventListener('mousedown', onMouseDown, false );
	document.getElementById("pixel_canvas").addEventListener('touchstart', onMouseDown, false );

	function onMouseDown(grid) {
		
		isDrawing = true;

		current_color = $(event.target).css('background-color');

        var target_name = $(event.target)[0].getAttribute('class');

        if (target_name == 'cells'){

            var x = $(event.target.cellIndex)[0];
            var y = $(event.target.parentNode.rowIndex)[0];

            var tbl = $('table tr');

            if (typeof x == 'undefined'){
                x = 0;
            }

            if (typeof y == 'undefined'){
                y = 0;
            }

            $(tbl[y].childNodes[x]).css('background-color', color);

            if (x < col_input - 1) {
                $(tbl[y].childNodes[x+1]).css('background-color', color);
            }

            if (x > 0) {
                $(tbl[y].childNodes[x-1]).css('background-color', color);
            }

            if (y < row_input - 1) {
                $(tbl[y+1].childNodes[x]).css('background-color', color);
            }

            if (y > 0) {
                $(tbl[y-1].childNodes[x]).css('background-color', color);
            }
        }
	}


	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'touchend', onMouseUp, false );

	function onMouseUp(grid) {
		isDrawing = false;

	}

  	document.getElementById("pixel_canvas").addEventListener( 'mousemove', onMove, false );
   	document.getElementById("pixel_canvas").addEventListener( 'touchmove', onMove, false );

	function onMove(grid) {

		grid.preventDefault();

		if (isDrawing == true) {

			var event_target = event.target


			if (event.type == "touchmove"){
       		
				var event_target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);

			}

			$(event.target).css('background-color', color); // Lets the chosen color on a click event to be added to the grid
			
			var x = $(event_target.cellIndex)[0];
            var y = $(event_target.parentNode.rowIndex)[0];


            if (typeof x == 'undefined' || typeof y == 'undefined'){
               return
            }

            var tbl = $('table tr');

            $(tbl[y].childNodes[x]).css('background-color', color);

            if (x < row_input - 1) {
                $(tbl[y].childNodes[x+1]).css('background-color', color);
            }

            if (x > 0) {
                $(tbl[y].childNodes[x-1]).css('background-color', color);
            }

            if (y < col_input - 1) {
                $(tbl[y+1].childNodes[x]).css('background-color', color);
            }

            if (y > 0) {
                $(tbl[y-1].childNodes[x]).css('background-color', color);
            }

		}

        return
	}



	// --------------------------------------------------------------------------------------------------------

	$('#ClearDrawing').submit(function makeGrid(grid) {  // Creates the grid upon clicking the button 'Submit'

		// prevent refresh on form submit
		grid.preventDefault();

        //reset grid to white
        resetGrid();

	});


	$('#JudgeDrawing').submit(function makeGrid(grid) {  // Creates the grid upon clicking the button 'Submit'

		// prevent refresh on form submit
		grid.preventDefault();

        var csrftoken = getCookie('csrftoken');
		var your_number = 1;

        var tbl = $('table tr');
		var row;
		var cell;
		var jObject = {};

        var row_index = 0;
        var col_index = 0;

        //create grid of 28*28 size regardless of html table size
		for (var i = 0; i < 28; i++){
		    row_index = i - (28-row_input)/2;
		    if (row_index < 0 || row_index > (row_input - 1)){
		        row = null;
		    }else{
        	    row = $(tbl[row_index].childNodes);
		    }
			for (var j = 0; j < 28; j++){
			    col_index = j - (28-col_input)/2;
			    if (row == null || col_index < 0 || col_index > (col_input - 1) ){
                    cell = null;
			    } else {
                	cell = $(row[col_index]);
			    }

				//black (1) or white (0)
				if (cell == null){
				    jObject['row_' + i + '_col_' + j] = 0;
				}
				else if (cell.css('background-color') == 'rgb(0, 0, 0)'){
				    jObject['row_' + i + '_col_' + j] = 1;
				} else {
				    jObject['row_' + i + '_col_' + j] = 0;
				}

			}
		}

		jObject = JSON.stringify(jObject);

        //send pixel array to python script to read number.
        $.ajax({
           type: "POST",
           url: '/read-number/',
           datatype: "json",
           data: { csrfmiddlewaretoken: csrftoken, grid: jObject},
           success: function callback(response){
                        your_number = response;
                        var your_number_label = document.getElementById("your_number");
	                    your_number_label.innerHTML = "Your number is: " + your_number.toString();
                    }
        });

	});


	function resetGrid(){
	    var tbl = $('table tr');
		var row;
		var cell;


		// reset grid to white
		for (var i = 0; i < row_input; i++){
			row = $(tbl[i].childNodes);
			for (var j = 0; j < col_input; j++){
				cell = $(row[j]);
				cell.css('background-color', 'rgb(255, 255, 255)');
			}
		}

		var your_number_label = document.getElementById("your_number");
		your_number_label.innerHTML = "Your number is: ";
	}

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


});
