def parse(text: str) -> dict:
    lines = text.strip().split("\n")
    result = {}

    # 일반 키워드 
    keywords = {
        "Application date": "date",
        "Purchaser's Name": "buyer_name",
        "Applicant company": "owner_name",
        "address": "address",
        # "Applicant company contact": "company_contact",
    }

    used_keys = set()

    for idx, line in enumerate(lines):
        for keyword, result_key in keywords.items():
            if keyword in line and result_key not in used_keys and idx + 1 < len(lines):
                next_line = lines[idx + 1].strip()
                if next_line not in keywords.keys():
                    result[result_key] = next_line
                    used_keys.add(result_key)

    # ㅅ
    seq_keywords = [
        "Vehicle name(ENG)",
        "Year",
        "Identification number(13letters)",
        "unit price",
        "Sales amount Vehicle weight"
    ]

    seq_data = [
        "vehicle_name",
        "vehicle_year",
        "vehicle_id",
        "unit_price",
        "sales_amount",
        "vehicle_weight"
    ]

    for idx, line in enumerate(lines):
        if "Vehicle name(ENG)" in line:
            # 다음 5줄이 키워드, 그 다음 6줄이 값
            key_lines = lines[idx : idx + 5]
            value_lines = lines[idx + 5 : idx + 11]

            for i in range(min(len(seq_data), len(value_lines))):
                result[seq_data[i]] = value_lines[i].strip()
            break  

    return result

"""
신청화사명
신청회사주소
신청회사 연락처
신청 일자 
구매 바이어 성명 
구매 바이어 연락처 
최종 수출 국가 
차량 명칭(영문)
년식
차량등록증상의 차번호 13자리 
1
판매 금액 
차량 무게 

"""
"""{
  "parsed": {
    "lines": [
      "COMMERCIAL INVOICE & PACKING LIST",
      "1) Shipper/Exporter",
      "8) No. & date of invoice",
      "# Applicant company","해피머짐", 
      "name",
      "# Application date","2025 7.16",
      "Applicant company",
      " # address", 서울특별시 강남구 청담동",
      #Applicant company contact",
      "#information", "010-4319-5273",
      "9) Terms of Delivery and Payment",
      "2) For account & risk of Messers.",
      "# Purchaser's Name","왕준",
      " #Purchase Buyer Contact 010-0934-2915",
      "3) Notify party",
      "4) Port of loading",
      "INCHEON KOREA",
      "6) Vessel name",
      #"5) Final Destination", "Japan",
      "7) Sailing on or about",
      "10) L/C issuing bank",
      "Remark",
      "11) MARKS AND NUMBERS OF PKGS",
      "12) Description of Goods",
      "13) Quanti 14) Unit price 15) Amount",
      "USED CAR",
      "16) WEIGHT",
      "17) CBM",
      "1",
      {# 순서대로 매칭 
      "Vehicle name(ENG)",
      "Year",
      "Identification number(13letters)",
      "unit price",
      "Sales amount Vehicle weight",
      "SONATA",
      "2011",
      "1788213-811396",
      "1",
      "2700",
      "150",}
      "SUB TOTAL:",
      "1",
      "0",
      "signed by"
    ]
  }
}
    """