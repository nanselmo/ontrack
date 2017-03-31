//includes jQuery
function grades_to_pts(numeric_grade){
	var pts=0;
	if (numeric_grade>90){
  	pts=75;
      }
  else if (numeric_grade>80){
  	pts=50;
      }
  else if (numeric_grade>70){
    pts=25;
  }
  else {
     pts=0;
  }
  return pts;
}

function calculate(){
    var math_gr = parseInt($(":input[name='Math_grade']").val());
    var science_gr = parseInt($(":input[name='Science_grade']").val());
    var read_gr = parseInt($(":input[name='Reading_grade']").val());
    var ss_gr = parseInt($(":input[name='Social Studies_grade']").val());
    var nwea_math = parseInt($(":input[name='nwea_math']").val());
    var nwea_read = parseInt($(":input[name='nwea_read']").val());
    var entrance_exam = parseInt($(":input[name='hs_exam']").val());
    math_pts=grades_to_pts(math_gr);
    sci_pts=grades_to_pts(science_gr);
    read_pts=grades_to_pts(read_gr);
    ss_pts=grades_to_pts(ss_gr);
    grade_pts=math_pts+sci_pts+read_pts+ss_pts;
    nwea_points=nwea_math+nwea_read
    ses_points_nwea=1.515*(nwea_points);
    ib_points_nwea=2.2727*(nwea_points);
    exam_points=3.03*entrance_exam;
    var total = grade_pts+ses_points_nwea+exam_points ;
    $(".totPoints").text(Math.round(total));

   	var new_points = parseInt($(".totPoints").text());

    $(".check-points").each(function( index ) {
		 var this_hs_points = parseInt($(this).find(".hs-pts").text());
		 alert(this_hs_points)
     if (new_points>this_hs_points)
     {
        $(this).children(".hs-pts-status").attr('class', 'hs-pts-status green-check');}
        else if (new_points+ 50>this_hs_points){
					$(this).children(".hs-pts-status").attr('class', 'hs-pts-status orange-okay');
				}
				else {
         $(this).children(".hs-pts-status").attr('class', 'hs-pts-status red-x');
        }
});





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
