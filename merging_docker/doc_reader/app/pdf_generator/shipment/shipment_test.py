import requests

url = "http://localhost:8000/pdf/fill_form"  # FastAPI 서버 주소

# 전송할 데이터 (예: 말소 서식용)
payload = {
    "form_type": "shipment",  # 템플릿 종류
    "data": {
        "applicantName": "머징",
        "applicantAddress": "인천광역시 미추홀구 인하로 100",
        "applicantContact": "+82-10-1234-5678",
        "puchaserName": "Moong",
        "pushaserContact": "+86-123-3456-7890",
        "destination": "China",
        "buyerName": "Woochan",
        "vehicleName": "SONATA",
        "vehicleYear": "2015",
        "vehicleId": "WVGZZZ5NZFW551100",  
        "quantity":"1",
        "unitPrice": "7,165,000",
        "salesAmount": "7,165,000",
        "vehicleWeight": "1,800",
        "invoiceDate": "2025-07-10"
    }
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
if response.status_code == 200:
    with open("ship_test_form.pdf", "wb") as f:
        f.write(response.content)
    print(" PDF 파일 저장 완료: ship_test_form.pdf")
else:
    print(" 에러 발생:")
    print(response.json())

