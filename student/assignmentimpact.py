import pandas
from student.models import Assignment
from django.db import connection
from dateutil import parser
from student.hardcoded import Q4_Start_Date

def get_numerical_score(score):
    score=pandas.to_numeric(score,errors="ignore")
    if isinstance(score, int) or isinstance(score, float):
        adj_score= score
    else:
    #if a teacher enters a numerical score, the denominatior is set to 100
    #the numerical values are taken from CPS' gradebook website.
        up_score=score.upper()
        if up_score == "A":
            adj_score = 96
        elif up_score == "B":
            adj_score = 86
        elif up_score == "C":
            adj_score = 76
        elif up_score == "D":
            adj_score = 66
        elif up_score == "F":
            adj_score = 60
        elif up_score == "MSG":
            adj_score = 0
        elif up_score == "INC":
            adj_score = 0
        elif up_score == "X":
            adj_score = 0
        else:
            adj_score="Err"
    return adj_score

def get_clean_assignments(assign_df):
    #drop EXC and null values
    clean_df=assign_df.dropna(subset=["Score"])
    #from the db query, nulls are "nan" so drop those too
    clean_df=clean_df[clean_df['Score']!="nan"]
    clean_df=clean_df[clean_df["Score"]!="Exc"]
    clean_df['Score'] = clean_df.apply(lambda each_assign: get_numerical_score(each_assign['Score']), axis=1)
    clean_df['ScorePossible']=clean_df['ScorePossible'].apply(pandas.to_numeric)
    clean_df['CategoryWeight']=clean_df['CategoryWeight'].apply(pandas.to_numeric)
    return(clean_df)


def get_assign_impact(student_id, course):
        assign_sql = "SELECT assign_name AS ASGName, assign_score AS Score,\
        category_name AS CategoryName, grade_entered, \
        assign_score_possible AS ScorePossible, category_weight AS CategoryWeight \
        FROM student_assignment \
        WHERE student_id = '%s'   \
        AND student_assignment.subject_id='%s'"%(student_id, course)

        assign_details_df=pandas.read_sql(assign_sql, connection)

        #get current quarter assignments only
        #Q4_Start_Date hardcoded in hardcoded.py
        Q4_date=parser.parse(Q4_Start_Date, dayfirst=False)
        #convert grade_entered to date time in order to compare
        assign_details_df['grade_entered'] =  pandas.to_datetime(assign_details_df['grade_entered'])
        current_assignments_df=assign_details_df[assign_details_df['grade_entered']>=Q4_date]


        if len(current_assignments_df) == 0:
            return("No assignments")

        else:
            #make Score Columns numerical and drop Excused and Null values
            assign_clean = get_clean_assignments(current_assignments_df)


            categories=assign_clean.groupby(["CategoryName", 'CategoryWeight']).size().rename('counts').reset_index()

            def get_cats(catName):
                return categories.loc[categories.CategoryName == catName].counts.item()

            def get_cat_weight(catName):
                return categories.loc[categories.CategoryName == catName].CategoryWeight.item()

            def get_pct(score, total):
                try:
                    float(score)
                    pct=float(score) / float(total)
                    pct=round(pct,2)*100
                except:
                    pct=""
                return pct

            def get_adj_score(score):
                try:
                    int(score)
                    adj_score=score
                except:
                    if score == "A":
                        adj_score = 10
                    elif score == "B":
                        adj_score = 9
                    elif score == "C":
                        adj_score = 8
                    elif score == "D":
                        adj_score = 7
                    elif score == "F":
                        adj_score = 6
                    else:
                        adj_score = 0

                return adj_score



            def get_impact(pct, weight, total_assigns):
                try:
                    int(pct)
                    impact = ((100-pct)*weight)/float(total_assigns)
                    impact=impact/100
                except:
                    impact= 0
                return impact

            assign_clean['numAssgnInCat'] = assign_clean.apply(lambda each_assign: get_cats(each_assign['CategoryName']), axis=1)
            assign_clean['Pct']=assign_clean.apply(lambda each_assign: get_pct(each_assign['Score'], each_assign['ScorePossible']), axis=1)
            assign_clean["Impact"] = assign_clean.apply(lambda each_assign: get_impact(each_assign["Pct"],
                                                                   each_assign["CategoryWeight"],
                                                                  each_assign["numAssgnInCat"]), axis=1)
            assign_clean=assign_clean.sort(['Impact'], ascending=0)

            column_order= ['ASGName', 'Score','ScorePossible','Pct','CategoryName','Impact']
            assign_clean = assign_clean[column_order]
            column_names= ['Assignment', 'Score','ScorePossible','Pct','Category','Impact']
            assign_clean.columns = column_names
            assign_clean_df=assign_clean.round({'Impact': 2, 'Pct': 0})

            #group assignments by category to show highest impact category
            assign_summary_df=assign_clean[['Score', 'ScorePossible', 'Impact', 'Category', 'Pct']].groupby(['Category']).agg('sum')
            assign_summary_df=assign_summary_df.reset_index().sort(['Impact'], ascending=0)
            assign_summary_df['Pct']=100*assign_summary_df['Score'].astype(int)/assign_summary_df['ScorePossible'].astype(int)
            assign_summary_df=assign_summary_df.round({'Pct': 0})
            assign_summary_df['NumGrades'] = assign_summary_df.apply(lambda each_cat: get_cats(each_cat['Category']), axis=1)
            assign_summary_df['CatWeight'] = assign_summary_df.apply(lambda each_cat: get_cat_weight(each_cat['Category']), axis=1)
            column_order= ['Category','CatWeight','NumGrades','Score','ScorePossible','Pct','Impact']
            assign_summary_df = assign_summary_df[column_order]
            column_names= ['Category','Weight','NumGrades','Points','PointsPossible','Pct','TotImpact']
            assign_summary_df.columns = column_names
            assign_summary_df= assign_summary_df.sort(['TotImpact'], ascending=0)

            return(assign_clean_df, assign_summary_df)
