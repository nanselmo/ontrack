//includes jQuery
function get_points(numeric_grade) {
  var pts = 0;
  if (numeric_grade > 90) {
    se_pts = 75;
    ib_pts = 112.5;
  } else if (numeric_grade > 80) {
    se_points = 50;
    ib_points = 75;
  } else if (numeric_grade > 70) {
    se_points = 25;
    ib_points = 38;
  } else {
    se_points = 0
    ib_points = 0
  }
  return {
    'ib': ib_points,
    'se': se_points
  };
}

function calculate() {
  var math_gr = parseInt($(":input[name='Math_grade']").val());
  var science_gr = parseInt($(":input[name='Science_grade']").val());
  var read_gr = parseInt($(":input[name='Reading_grade']").val());
  var ss_gr = parseInt($(":input[name='Social Studies_grade']").val());
  var nwea_math = parseInt($(":input[name='nwea_math']").val());
  var nwea_read = parseInt($(":input[name='nwea_read']").val());
  var entrance_exam = parseInt($(":input[name='hs_exam']").val());
  var tot_ib = 0;
  var tot_se = 0;

  //points for 4 core grades
  grades = [math_gr, science_gr, ss_gr, read_gr]
  for (i = 0; i < grades.length; ++i) {
    tot_ib = tot_ib + get_points(grades[i])['ib'];
    tot_se = tot_se + get_points(grades[i])['se'];
  }

  //nwea points
  nwea_points = nwea_math + nwea_read;
  tot_se = tot_se + 1.515 * (nwea_points);
  tot_ib = tot_ib + 2.2727 * (nwea_points);


  //points from selective enrollment test
  tot_se = tot_se + 3.03 * entrance_exam;

  //set total points to the new values
  $(".totSEpoints").text(Math.round(tot_se));
  $(".totIBpoints").text(Math.round(tot_ib));

  var new_se_points = parseInt($(".totSEpoints").text());
  var new_ib_points = parseInt($(".totIBpoints").text());

  $(".check-points").each(
    function(index)
		{
	      var this_hs_points = parseInt($(this).find(".hs-pts").text());
	      var this_hs_type = $(this).find(".hs-type").text();

	   		if (this_hs_type == "IB"){
	      	var new_points = new_ib_points;
	      } else {
	      	var new_points = new_se_points;
	      }
	      if (new_points > this_hs_points) {
	        $(this).children(".hs-pts-status").attr('class', 'hs-pts-status green-check');
	      } else if (new_points + 50 > this_hs_points) {
	        $(this).children(".hs-pts-status").attr('class', 'hs-pts-status orange-okay');
	      } else {
	        $(this).children(".hs-pts-status").attr('class', 'hs-pts-status red-x');
	      }
				$(this).find(".hs-remain-pts").text(this_hs_points - new_points);

				// get new remaining points
				var this_hs_remain_pts = parseInt($(this).find(".hs-remain-pts").text());
				if (this_hs_remain_pts<=0){
						$(this).find(".hs-remain-pts").attr('class','white-text hs-remain-pts');
				}
				else{
					$(this).find(".hs-remain-pts").attr('class','grey-text hs-remain-pts');
				}
    }
  );
}

$().ready(function() {
  calculate();
  $(".minus").click(function() {
    var $input = $(this).parent().prev().find('.input-text');
    var newValue = 0;
    if ($input.val() != 0) {
      newValue = parseInt($input.val()) - 1;
    } else {
      newValue = parseInt($input.val());
    }
    $input.val(newValue);
    calculate();
  });
  $(".plus").click(function() {
    var $input = $(this).parent().next().find('.input-text');
    var newValue = 0;
    if ($input.val() != 100) {
      newValue = parseInt($input.val()) + 1;
    } else {
      newValue = parseInt($input.val());
    }
    $input.val(newValue);
    calculate();

  });
});
