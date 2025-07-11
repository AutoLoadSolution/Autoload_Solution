from app.pdf_generator.deregistration.generate_deregistration import generate_deregistration
from app.pdf_generator.roro.generate_roro import generate_roro
from app.pdf_generator.shipment.generate_shipment import generate_shipment

def fill_by_type(form_type: str, template_path: str, output_path: str, data: dict):
    if form_type == "deregistration":
        return generate_deregistration(template_path, output_path, data)
    elif form_type == "roro":
        return generate_roro(template_path, output_path, data)
    elif form_type == "shipment":
        return generate_shipment(template_path, output_path, data)
    else:
        raise ValueError(f"Unsupported form_type: {form_type}")