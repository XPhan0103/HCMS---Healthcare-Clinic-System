import docx
import json

doc = docx.Document("Document/02_Requirements/HCMS_SRS_v0.1.docx")
data = []
for para in doc.paragraphs:
    if para.text.strip():
        data.append(para.text.strip())

with open("scratch_text.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(data))
