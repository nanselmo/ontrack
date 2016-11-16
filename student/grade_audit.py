import pandas
import numpy
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from pandas import ExcelWriter


#need teacher list from GradeActivityReport (I just copy and pasted from Gradebook Reports)
teacher_div=pandas.read_csv("ontrack/student-data/2016-2017-Section-Teacher_Roster.csv")
#note that Science has two spaces inbetween Science and Standards "Science**Standards"
missing_assignments = pandas.read_csv("ontrack/student-data/GB-MissingZeros-10-28-16.csv")
unused_cats = pandas.read_csv("ontrack/student-data/GB-Unused-Cats-10-28-16.csv")
teacher_cats = pandas.read_csv("ontrack/student-data/GB-All-Cats-10-28-16.csv")
grades=pandas.read_csv("ontrack/student-data/Grades-10-28-16.csv")


grades2 = grades.rename(columns={'StudentHomeroom': 'Section', 'SubjectName': 'Course'})
grades_clean=grades2.dropna(subset=['QuarterAvg'])


missing_summary=missing_assignments.groupby(['TeacherLast', 'TeacherFirst', 'Score']).size().reset_index(name="NumofStudents")
missing_summary['FullName']=missing_summary['TeacherLast'] + " " + missing_summary['TeacherFirst']
missing_summary=missing_summary[["FullName", "Score", "NumofStudents"]]


#get a list of unique names
teacher_cats['FullName']=teacher_cats['TeacherLastName'] + " " + teacher_cats['TeacherFirstName']
#using pandas google app engine
full_names=teacher_cats['FullName'].unique().tolist()


def summarize_data(num):


    #assignments
    if num=="admin":
        assignments = missing_assignments
    else:
        teach_last_name = full_names[num].split()[0]
        teach_first_name =  full_names[num].split()[1]
        assignments = missing_assignments[(missing_assignments['TeacherFirst']==teach_first_name)
                                          & (missing_assignments['TeacherLast']==teach_last_name)]


    assign_split = assignments.groupby(["ClassName", "ASGName", "Score"]).size().reset_index(name="NumAssigns")
    assign_full= assignments.groupby(['ClassName']).size().reset_index(name="NumAssigns")
    assign_full = assign_full.sort_values('NumAssigns', ascending=False)



    #unused cats
    if num=="admin":
        teach_unused_cats=unused_cats
        unused_cats["FullName"] = unused_cats["Teacher Last"] + ", " + unused_cats["Teacher First"]
        unused_cats_class_quant = teach_unused_cats.groupby(['Class Name']).size().reset_index(name='NumCategories')
        unused_cats_names = teach_unused_cats.groupby(['Unused Category']).size().reset_index(name='NumSections')
        unused_cats_pivot = pandas.pivot_table(teach_unused_cats[["FullName", "Unused Category", "Category Weight"]],
                             index=["FullName", "Unused Category"])

    else:
        teach_unused_cats=unused_cats[(unused_cats['Teacher First']==teach_first_name) &
                               (unused_cats['Teacher Last']==teach_last_name)]
        unused_cats_full = teach_unused_cats.groupby(['Class Name']).size().reset_index(name='NumCategories')
        unused_cats_split = teach_unused_cats.groupby(['Unused Category']).size().reset_index(name='NumSections')


    #teacher logic
    if num=="admin":
        all_cats = teacher_cats
        #cats that don't add up (admin only)
        error_cats = teacher_cats[teacher_cats['TotalWeight']!=100]
        #category break down by class
        error_cat_pivot=pandas.pivot_table(error_cats[["FullName", "CategoryName",
                                            "CategoryWeight", "TotalWeight"]],
                             index=["FullName", "CategoryName",
                                    "CategoryWeight"])

    else:
        all_cats = teacher_cats[(teacher_cats['FullName']==full_names[num])]
        cat_pivot=pandas.pivot_table(all_cats[["ClassName", "CategoryName",
                                            "CategoryWeight", "TotalWeight"]],
                             index=["ClassName", "CategoryName",
                                    "CategoryWeight"])

    cats_group = all_cats.groupby(['CategoryName']).size().reset_index(name="NumofAssigns").sort_values('NumofAssigns', ascending=False)
    cat_pct = all_cats.groupby(['ClassName', 'TotalWeight']).size().reset_index(name="Num of Categories")










    #some grades are being lost in this merge!
    grades_by_teacher=pandas.merge(grades_clean, teacher_div, on=['Course', 'Section'])


    if num !="admin":
        grades_by_teacher=grades_by_teacher[grades_by_teacher["Teacher"] == "%s, %s" %(full_names[num].split()[0], full_names[num].split()[1])]

    grades_by_teacher=grades_by_teacher[["QuarterAvg", "FinalAvg", "Teacher", "Course", "FullSectionName"]]
    #convert quarteravg to numeric
    grades_by_teacher[['QuarterAvg']] = grades_by_teacher['QuarterAvg'].apply(pandas.to_numeric, errors='coerce')
    failing_grades=grades_by_teacher[["Teacher", "Course", "FullSectionName", "QuarterAvg"]][grades_by_teacher["QuarterAvg"] <= 60].groupby(["Teacher", "Course", "FullSectionName"]).count()



    env = Environment(loader=FileSystemLoader('.'))

    #teacher and admin


    if num == "admin":
        #admin
        template_vars = {
                     "teacher_categories": error_cat_pivot.to_html(),
                     "teacher_unused_cats": unused_cats_pivot.to_html(),
                     "teacher_missing_assign": assign_split.to_html(index=False),
                     "failing_grades" : failing_grades.to_html()
                      }
        pdf_title= "Admin-Assignment-Report.pdf"

    else:

        template_vars = {"title" : teach_last_name,
                     "teacher_categories": cat_pivot.to_html(),
                     "teacher_unused_cats": unused_cats_split.to_html(index=False),
                     "teacher_missing_assign": assign_split.to_html(index=False),
                     "failing_grades" : failing_grades.to_html()
                      }

    return(template_vars)
