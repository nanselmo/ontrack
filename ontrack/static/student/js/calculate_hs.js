//includes jQuery
function grades_to_pts(numeric_grade){
	var pts=0;
	if (numeric_grade>90){
  	ses_pts=75;
		ib_pts=112.5;
      }
  else if (numeric_grade>80){
		ses_points=50;
		ib_points=75;
      }
  else if (numeric_grade>70){
		ses_points=25;
		ib_points=38;
  }
  else {
		ses_points=0
		ib_points=0
  }
  return {'ib': ib_points, 'ses':ses_points};
}

function calculate()
{
    var math_gr = parseInt($(":input[name='Math_grade']").val());
    var science_gr = parseInt($(":input[name='Science_grade']").val());
    var read_gr = parseInt($(":input[name='Reading_grade']").val());
    var ss_gr = parseInt($(":input[name='Social Studies_grade']").val());
    var nwea_math = parseInt($(":input[name='nwea_math']").val());
    var nwea_read = parseInt($(":input[name='nwea_read']").val());
    var entrance_exam = parseInt($(":input[name='hs_exam']").val());
		var tot_ib=0;
		var tot_ses=0;
		grades=["math_gr", "science_gr", "ss_gr", "read_gr"]
		grades.each(index, subject){
			tot_ib=tot_ib+grades_to_pts(grade_dict[index])['ib']
			tot_ses=tot_ses+grades_to_pts(grade_dict[index])['ses']
		}


    nwea_points=nwea_math+nwea_read
    ses_points_nwea=1.515*(nwea_points);
    ib_points_nwea=2.2727*(nwea_points);
    exam_points=3.03*entrance_exam;
    var total = tot_ib+ses_points_nwea+exam_points ;
    $(".totPoints").text(Math.round(total));

   	var new_points = parseInt($(".totPoints").text());

    $(".check-points").each(
				function( index )
			{
			 var this_hs_points = parseInt($(this).find(".hs-pts").text());
	     if (new_points>this_hs_points)
	        {
	        $(this).children(".hs-pts-status").attr('class', 'hs-pts-status green-check');}
	        else if (new_points+ 50>this_hs_points){
						$(this).children(".hs-pts-status").attr('class', 'hs-pts-status orange-okay');
					}
					else {
	         $(this).children(".hs-pts-status").attr('class', 'hs-pts-status red-x');
	        }
				}
		);
}

$().ready(function(){
    calculate();
    $(".minus").click(function(){
        var $input = $(this).parent().prev().find('.input-text');
        var newValue = 0;
        if ($input.val()!=0){
        	newValue = parseInt($input.val()) - 1;
        }
        else{
        	newValue = parseInt($input.val());
        }
        $input.val(newValue);
        calculate();
    });
    $(".plus").click(function(){
        var $input = $(this).parent().next().find('.input-text');
        var newValue = 0;
        if ($input.val()!=100){
        	newValue = parseInt($input.val()) + 1;
        }
        else{
        	newValue = parseInt($input.val());
        }
        $input.val(newValue);
        calculate();

    });
});
