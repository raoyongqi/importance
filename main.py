from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from openpyxl import load_workbook
from typing import List, Dict

app = FastAPI()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    # Read the Excel file
    contents = await file.read()
    workbook = load_workbook(filename=bytes(contents), data_only=True)
    sheet = workbook.active

    # Extract data from the sheet
    data = []
    for row in sheet.iter_rows(values_only=True):
        if row[0] and row[1]:  # Skip rows with empty feature or importance
            data.append({
                "feature": row[0],
                "importance": row[1]
            })

    # Sort data by importance
    data.sort(key=lambda x: x['importance'], reverse=True)

    return JSONResponse(content={"data": data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
