from app.parser import parse_calcelation_invoice, parse_registration_apply

def parse_by_type(form_type: str, text: str):
    if form_type == "apply":
        return parse_registration_apply.parse(text)
    elif form_type == "invoice":
        return parse_calcelation_invoice.parse(text)
    else:
        raise ValueError("지원되지 않는 문서 양식입니다.")