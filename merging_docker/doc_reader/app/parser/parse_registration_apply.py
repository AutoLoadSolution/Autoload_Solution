import re

def parse(text: str) -> dict:
    lines = text.strip().split("\n")
    result = {}

    def get_line_after(keyword, offset=1, join=1):
        for idx, line in enumerate(lines):
            if keyword in line:
                start = idx + offset
                end = start + join
                return " ".join([
                    lines[i].strip()
                    for i in range(start, end)
                    if i < len(lines)
                ])
        return ""

    # 각 항목 추출
    result["ownerName"] = get_line_after("성명", 2, 1)
    
    raw_ssn = get_line_after("주민등록번호(법인등록번호)", 2, 2)  
    parts = raw_ssn.strip().split()
    if len(parts) == 2 and all(part.isdigit() for part in parts):
        result["SSN"] = f"{parts[0]}-{parts[1]}"
    else:
        result["SSN"] = raw_ssn  # fallback

    result["address"] = get_line_after("주소",2, 2)  
    
    result["email"] = get_line_after("전자우편",2, 1)
    
    result["phoneNumber"] = get_line_after("휴대)전화번호",2, 1)

    result["registration_no"] = get_line_after("자동차등록번호", 2, 1)

    result["vehicle_id"] = get_line_after("차대 번호",8, 1)
    
    result["mileage"] = get_line_after("주행거리")

    return result


'''def parse(text: str) -> dict:
    lines = text.strip().split("\n")
    return {
        "lines": lines
    }
'''