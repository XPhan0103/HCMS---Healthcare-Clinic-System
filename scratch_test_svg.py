import docx
doc = docx.Document()
try:
    doc.add_picture('Document/03_Design/03_UI/UX/parent_dashboard.svg')
    print("Success")
except Exception as e:
    print(f"Error: {e}")
doc.save('scratch_test_svg.docx')
