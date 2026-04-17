import docx
from docx.shared import Pt

file_path = r'e:\Documents\Ky_8\Co Dieu AISDLC\HCMS---Healthcare-Clinic-System\Document\02_Requirements\HCMS_SRS_v0.1.docx'
doc = docx.Document(file_path)

body = doc._body._body

start_elem = None
end_elem = None

for p in doc.paragraphs:
    txt = p.text.strip()
    if txt == "2.1 <<Feature Name1>>":
        start_elem = p._element
    elif txt == "2.2 Xyz Feature":
        end_elem = p._element

if start_elem is not None and end_elem is not None:
    # Found markers, delete everything starting from start_elem to JUST BEFORE end_elem
    elements_to_delete = []
    
    in_range = False
    for elem in body:
        if elem == start_elem:
            in_range = True
            
        if elem == end_elem:
            in_range = False
            
        if in_range:
            elements_to_delete.append(elem)
            
    for elem in elements_to_delete:
        body.remove(elem)
else:
    print("Could not find markers")
print("Done checking structure.")
