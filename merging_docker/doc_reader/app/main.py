import app.config
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.pdf_generator.factor import fill_by_type
import os
import traceback

app = FastAPI(title ='OCR Uplaod 및 인보이스 출력', description='')

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)


@app.post("/ocr/upload")
async def upload_ocr_img(
    file: UploadFile = File(...),
    form_type: str = Form(...)
):
    try:
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        from app.ocr_utils import extract_text
        text = extract_text(temp_path)

        from app.parser.factory import parse_by_type
        parsed = parse_by_type(form_type, text)

        os.remove(temp_path)

        return {"parsed": parsed}
    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "trace": traceback.format_exc()
        }

def transform_data_for_deregistration(data):
    """프론트엔드 데이터를 말소 신청서 형식으로 변환"""
    return {
        "applicantName": data.get("applicantName", ""),
        "applicantAddress": data.get("applicantAddress", ""),
        "applicantContact": data.get("applicantContact", ""),
        "puchaserName": data.get("puchaserName", ""),
        "pushaserContact": data.get("pushaserContact", ""),
        "destination": data.get("destination", ""),
        "vehicleName": data.get("vehicleName", ""),
        "vehicleYear": data.get("vehicleYear", ""),
        "vehicleId": data.get("vehicleId", ""),
        "quantity": data.get("quantity", ""),
        "unitPrice": data.get("unitPrice", ""),
        "salesAmount": data.get("salesAmount", ""),
        "vehicleWeight": data.get("vehicleWeight", ""),
        "invoiceDate": data.get("invoiceDate", "")
    }

@app.post("/pdf/fill_form")
async def fill_pdf(request: Request):
    try:
        json_data = await request.json()
        form_type = json_data.get("form_type")
        raw_data = json_data.get("data")
        
        print(f"[DEBUG] 받은 form_type: {form_type}")
        print(f"[DEBUG] 받은 데이터: {raw_data}")

        # 절대 경로로 템플릿 경로 설정
        current_dir = os.path.dirname(os.path.abspath(__file__))
        template_map = {
            "deregistration": os.path.join(current_dir, "pdf_generator/template/deregistration_invoice_unfilled_form.pdf"),
            "roro": os.path.join(current_dir, "pdf_generator/template/roro_unfilled_form.pdf"),
            "shipment": os.path.join(current_dir, "pdf_generator/template/shipment_invocie_unfilled_form.pdf")
        }

        template_path = template_map.get(form_type)
        if not template_path:
            print(f"[ERROR] 지원하지 않는 form_type: {form_type}")
            return {"error": f"Invalid form_type: {form_type}"}
            
        if not os.path.exists(template_path):
            print(f"[ERROR] 템플릿 파일 없음: {template_path}")
            return {"error": f"Template file not found: {template_path}"}

        print(f"[DEBUG] 사용할 템플릿: {template_path}")

        # 데이터 변환 (deregistration의 경우 인보이스 형태 데이터 사용)
        if form_type == "deregistration":
            data = transform_data_for_deregistration(raw_data)
        else:
            data = raw_data

        print(f"[DEBUG] 변환된 데이터: {data}")

        output_path = f"{form_type}_{os.getpid()}.pdf"  # 프로세스 ID로 고유 파일명 생성
        print(f"[DEBUG] 출력 파일: {output_path}")
        
        fill_by_type(form_type, template_path, output_path, data)

        if os.path.exists(output_path):
            file_size = os.path.getsize(output_path)
            print(f"[DEBUG] PDF 생성 완료, 크기: {file_size} bytes")
            return FileResponse(output_path, filename=f"document_{form_type}.pdf")
        else:
            print(f"[ERROR] PDF 파일이 생성되지 않음: {output_path}")
            return {"error": "PDF file was not created"}

    except Exception as e:
        error_msg = str(e)
        trace = traceback.format_exc()
        print(f"[ERROR] PDF 생성 중 오류: {error_msg}")
        print(f"[ERROR] 상세 오류:\n{trace}")
        return {
            "error": error_msg,
            "trace": trace
        }