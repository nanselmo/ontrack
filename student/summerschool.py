import pandas
from student.models import DataFile



def get_ss_report(the_files, in_mem):
    jupyter = False
    nwea_file_count=0

    for each_file in the_files:

        if jupyter:
            df = pandas.read_csv(each_file)
            the_file=each_file
        if in_mem:
            the_file = DataFile(document = each_file)
            df = pandas.read_csv(the_file.document)
            file_name= the_file.filename()
        else:
            df = pandas.read_csv(open(the_file,'rb'))
            file_name=the_file

        if "Grade" in file_name:
            grades_raw=df
        elif ("DL" in file_name) or ('Special' in file_name):
            dl_raw=df
        elif "NWEA" in file_name:
            nwea_file_count=nwea_file_count + 1
            nwea_date=df['TestStartDate'].iloc[0]
            if nwea_file_count == 1:
                nwea_1=df
                file1_date=nwea_date
            if nwea_file_count ==2:
                nwea_2=df
                file2_date=nwea_date
                if file1_date > file2_date:
                  nwea_this_year_raw=nwea_1
                  nwea_last_year_raw=nwea_2
                else:
                  nwea_this_year_raw=nwea_2
                  nwea_last_year_raw=nwea_1


    #just get the data we want from the files

    #just get needed columns from grades data frame
    grades=grades_raw[["StudentID", "StudentFirstName", "StudentLastName",
                       "StudentHomeroom", "StudentGradeLevel", "SubjectName", "FinalAvg"]]

    # just get needed columns from DL data frame
    dl=dl_raw[['Student ID', 'ELL', 'LRE', 'ARS', 'PDIS']]

    #since we're cleaning up more that one NWEA file, we should make function to just return ID, Discipline and Test % for NWEA
    def process_nwea(orig_df):
        new_df=orig_df[['StudentID', 'Discipline', 'TestPercentile']]
        return(new_df)

    #use that function on the raw_nwea data frames.
    #these new data frames will just have 'StudentID', 'Discipline', 'TestPercentile' since we applied the
    #process_nwea() function to them
    nwea_last_year=process_nwea(nwea_last_year_raw)
    nwea_this_year=process_nwea(nwea_this_year_raw)

    nwea_both=pandas.merge(nwea_last_year, nwea_this_year, on =["StudentID", "Discipline"])
    #nwea
    nwea_both=nwea_both.rename(columns={'TestPercentile_x': 'NWEA_Pct_Now','TestPercentile_y': 'NWEA_Pct_LY'})


    def make_wide_nwea(long_df, suffix):
        wide_df=long_df.pivot_table(index="StudentID", columns="Discipline", values="TestPercentile")
        wide_df.reset_index(inplace="True")
        wide_df=wide_df.rename(columns={'Mathematics': 'Mathematics_' + suffix,'Reading': 'Reading_'+suffix})
        return(wide_df)

    nwea_last_year_wide=make_wide_nwea(nwea_last_year, "LY")
    nwea_this_year_wide=make_wide_nwea(nwea_this_year, "TY")
    nwea_full=pandas.merge(nwea_last_year_wide, nwea_this_year_wide, on="StudentID")

    def get_high_score(row, subject):
        ly=row[subject+"_LY"]
        ty=row[subject+"_TY"]
        if float(ly)>float(ty):
            high_score=ly
        else:
            high_score=ty
        return(high_score)


    nwea_full["NWEA_M_High"]= nwea_full.apply(get_high_score, args=("Mathematics",), axis=1)
    nwea_full["NWEA_R_High"]= nwea_full.apply(get_high_score, args=("Reading",), axis=1)



    #filter by grade level and (&) by subject by using isin() and then a list ["A", "B", "C"]
    grades=grades[grades["StudentGradeLevel"].isin(['03', '06', '08', '3', '6', '8']) &
                  grades["SubjectName"].isin(['CHGO READING FRMWK', 'MATHEMATICS STD', 'ALGEBRA'])]


    #manipulate the data to get new columns


    #make a roster so we can manipulate the grades by themselves
    roster=grades[['StudentID', 'StudentFirstName', 'StudentLastName',
                   'StudentHomeroom', 'StudentGradeLevel']].drop_duplicates()

    #get just the studentid, subject and grade so that we can see just a row with a student id
    #with two columns, the math final avg and reading final avg
    prep_grades=grades[["StudentID", "SubjectName", "FinalAvg"]]

    #this takes prep_grades from long to wide, so one row per student instead of one row per subject
    grades_wide=prep_grades.pivot_table(index="StudentID",  columns="SubjectName", values="FinalAvg")
    grades_wide.reset_index(inplace=True)

    #rename the columns
    #grades_wide.columns=["StudentID", "R_Grade", "M_Grade", "Alg_Grade"]
    grades_wide = grades_wide.rename(columns={'ALGEBRA': 'Alg_Grade',
                                              'CHGO READING FRMWK': 'R_Grade',
                                              'MATHEMATICS STD': 'M_Grade'})


    #if there's no math grade, change it to the value of the algebra grade
    def get_math_grade(row):
        if pandas.isnull(row["M_Grade"]) & pandas.notnull(row["Alg_Grade"]):
            grade=row["Alg_Grade"]
        else:
            grade=row["M_Grade"]
        return(grade)


    grades_wide['M/Alg_Grade']= grades_wide.apply(get_math_grade, axis=1)



    # to just rename one column, you can pass the old column name first then the new columns name
    #as a key:value pair, separated by commas
    #{"old1":"new1", "old2":"new2"}
    dl=dl.rename(columns={'Student ID': 'StudentID'})

    #merge everything together
    ss_data=pandas.merge(roster, dl, on="StudentID")
    ss_data=pandas.merge(ss_data, grades_wide, on="StudentID")
    ss_data=pandas.merge(ss_data, nwea_full[["StudentID", "NWEA_R_High", "NWEA_M_High"]], on="StudentID")
    ss_data.head()

    #function to decide Summer School Status
    def get_sss(row):
        #if their sped identification is SPL, 504 or none
        if row['PDIS'] in ['504', 'SPL', '--'] :
            if pandas.isnull(row['NWEA_R_High'])  or pandas.isnull(row['NWEA_M_High']) :
                sss= "Missing Test"
                ssdesc= "Summer School"
            else:
                if row['ELL'] == "Yes":
                    # if both greater than C they don't go (A)
                    if (row['R_Grade']>70) & (row['M/Alg_Grade']>70):
                        sss = "0A"
                        ssdesc= "No Summer School"
                    #if both grades greater than D AND the high test scores are both at or above 24
                    elif ((row['R_Grade']>60) & (row['M/Alg_Grade']>60)) & ((row['NWEA_R_High']>=24) & (row['NWEA_M_High']>=24)):
                        sss = "0A"
                        ssdesc= "No Summer School"
                    #otherwise they have to go (B)
                    else:
                        sss = "0B"
                        ssdesc= "ELL - Summer School"
                #not ELL
                else:
                    if (row['NWEA_R_High']>=24) & (row['NWEA_M_High']>=24):
                        #above a D
                        if (row['R_Grade']>60) & (row['M/Alg_Grade']>60):
                            sss= "1A"
                            ssdesc= "No Summer School"
                        else:
                            sss= "1B"
                            ssdesc= "Summer School, No Exam"
                    elif (row['NWEA_R_High']>=11) & (row['NWEA_M_High']>=11):
                        #above a C
                        if (row['R_Grade']>70) & (row['M/Alg_Grade']>70):
                            sss= "2A"
                            ssdesc= "No Summer School"
                        else:
                            sss= "2B"
                            ssdesc= "Summer School and Exam"
                    else:
                        if (row['R_Grade']>70) & (row['M/Alg_Grade']>70):
                            sss= "3A"
                            ssdesc= "Summer School and Exam"
                        else:
                            sss= "3B"
                            ssdesc= "Summer School and Exam"
        else:
            sss="Sped-Exempt"
            ssdesc= "No Summer School"

        return pandas.Series({'SSS': sss, 'SS_Description': ssdesc})


    # function to add warning column for students who are close to summer school

    def get_ss_warning(row):

        #if their sped identification is SPL, 504 or none
        if row['PDIS'] in ['504', 'SPL', '--'] :
                if row['ELL'] == "Yes":
                    # if either less than or equal to 66 give them a warning
                    if (row['R_Grade']<=66)  | (row['M/Alg_Grade']<=66):
                        ssw = "0W"
                        ssw_desc= "ELL-Warning: Close to a D in one subject"
                    #if either test scores are less than or equal to 29% and either grade is less than 76
                    #give them a warning
                    elif (

                        ( (row['R_Grade']<=76) | (row['M/Alg_Grade']<=76) )

                     &
                        ((row['NWEA_R_High']<=29) & (row['NWEA_M_High']<=29) )
                    ):

                        ssw = "0W"
                        ssw_desc= "ELL-Warning: Close to a C in one subject or close to 24% on NWEA"
                    else:
                        ssw = ""
                        ssw_desc= ""
                #not ELL
                else:

                    #below a 66 in either subject
                    if (row['R_Grade']<=66) | (row['M/Alg_Grade']<=66):
                        ssw= "1W"
                        ssw_desc= "Warning: Close to a D in one subject"
                    elif (
                        ((row['NWEA_R_High']>=16) & (row['NWEA_R_High']<=28))
                    &
                        ((row['NWEA_M_High']>=16) & (row['NWEA_M_High']<=28))
                        ):
                        #below a 76 in either subject
                        if (row['R_Grade']<=76) | (row['M/Alg_Grade']<=76):
                            ssw= "2W"
                            ssw_desc= "Warning: Close to C in one subject with low NWEA score"
                    elif(
                        (row['NWEA_R_High']<=15)
                    &
                        (row['NWEA_M_High']<=15)
                        ):
                        #below a 76 in either subject
                        if (row['R_Grade']<=76) | (row['M/Alg_Grade']<=76):
                            ssw= "3W"
                            ssw_desc= "Warning: Close to C in one subject with very low NWEA score"
                    else:
                        ssw = ""
                        ssw_desc= ""


        else: #if they're a sped student
            ssw = ""
            ssw_desc= ""

        if (row['SSS'] in ['0B', '1B', '2B', '3A', '3B', 'Missing Test']):
            ssw = ""
            ssw_desc= ""
        return pandas.Series({'SSW': ssw, 'Warning_Desc': ssw_desc})


    #run the get_sss and get_ss_warning functions on the ss_data to add two columns
    ss_data_summer_school=pandas.concat([ss_data, ss_data.apply(get_sss, axis=1)],  axis=1)
    ss_data_full=pandas.concat([ss_data_summer_school, ss_data_summer_school.apply(get_ss_warning, axis=1)],  axis=1)

    ss_data_full=ss_data_full.reset_index(drop=True)

    summer_school=ss_data_full[
    (ss_data_full['SSS'].isin(['0B', '1B', '2B', '3A', '3B', 'Missing Test'])) |
    (ss_data_full['SSW'].isin(['0W', '1W', '2W', '3W']))
    ]
    
    summer_school_kids=summer_school_kids.reset_index(drop=True)


    return(ss_data_full, summer_school_kids)
