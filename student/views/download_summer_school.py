from django.shortcuts import render
from student.user_types import user_types
import pandas

def download_summer_school(request):
    ss_kids = request.session.get('ss_kids', None)
    full_roster = request.session.get('full_roster', None)

    #in converting to JSON, the column order of the DF is messed up. here we reorder it
    ideal_order=['StudentID',
                 'StudentFirstName',
                 'StudentLastName',
                 'StudentHomeroom',
                 'StudentGradeLevel',
                 'ELL',
                 'LRE',
                 'ARS',
                 'PDIS',
                 'R_Grade',
                 'M_Grade',
                 'NWEA_R_High',
                 'NWEA_M_High',
                 'SSS',
                 'SS_Description',
                 'SSW',
                 'Warning_Desc']
    if full_roster != None:
        full_roster=pandas.read_json(full_roster)[ideal_order].sort_values(by=['StudentGradeLevel', 'SSS', 'StudentHomeroom'])
        ss_list=pandas.read_json(ss_kids)[ideal_order].sort_values(by=['StudentGradeLevel', 'SSS', 'StudentHomeroom'])
        if request.method == 'POST':
            filename="summer-school-roster.xlsx"
            sio = StringIO()
            writer = pandas.ExcelWriter(sio, engine='xlsxwriter')
            ss_codes_df = pandas.DataFrame({'Codes': ['0A', '0B', '1A', '1B', '2A', '2B', '3A', '3B'],
                                        'Description': ['ELL - No Summer School',
                                        'ELL-Summer School',
                                        '24% - No Summer School',
                                        '24% - Summer School, No Exam',
                                         '11-23% -  No Summer School',
                                         '11-23% -Summer School and Exam',
                                         '<10% - Summer School and Exam',
                                          '<10% - Summer School and Exam']})
            ss_codes_df.to_excel(writer, sheet_name='Summer School Codes')
            full_roster.to_excel(writer, sheet_name="Full-Roster", index=False)
            ss_list.to_excel(writer, sheet_name="SS-Roster", index=False)

            writer.save()
            sio.seek(0)
            workbook = sio.getvalue()
            response = HttpResponse(workbook, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = 'attachment; filename=%s' % filename
            return (response)
        else:
            #display the data on the page
            ss_kids_df=ss_list
            ss_kids_df=ss_kids_df[['StudentFirstName', 'StudentLastName', 'StudentGradeLevel',
            'StudentHomeroom', 'SSS', 'SS_Description', 'SSW', 'Warning_Desc']]
            ss_kids_html=ss_kids_df.to_html()
            return render(request, 'student/summerschoolresults.html', {'ss_list' : ss_kids_html})
    else:
        return render(request, 'student/error.html', {'error_name':'No summer school roster available', 'error_message':'There is no summer school roster in the database.'})

