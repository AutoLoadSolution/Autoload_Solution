from PyPDF2 import PdfReader, PdfWriter, Transformation
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from io import BytesIO
import os

# 폰트 경로 설정 및 등록
current_dir = os.path.dirname(os.path.abspath(__file__))
pdf_generator_dir = os.path.abspath(os.path.join(current_dir, ".."))
font_path = os.path.join(pdf_generator_dir, "font", "AppleSDGothicNeoSB.ttf")

if os.path.exists(font_path):
    try:
        pdfmetrics.registerFont(TTFont('AppleGothic', font_path))
        font_name = "AppleGothic"
    except Exception as e:
        print(f"[ERROR] 폰트 등록 실패: {str(e)}")
        font_name = "Helvetica"
else:
    print(f"[WARNING] 폰트 파일을 찾을 수 없습니다. 기본 폰트를 사용합니다.")
    font_name = "Helvetica"

def resize_pdf_to_a4(template_path, output_path):
    """템플릿 PDF를 A4 크기로 리사이즈"""
    try:
        with open(template_path, "rb") as template_file:
            template_pdf = PdfReader(template_file)
            output_pdf = PdfWriter()
            a4_width, a4_height = A4

            for page in template_pdf.pages:
                original_width = float(page.mediabox.width)
                original_height = float(page.mediabox.height)
                scale_x = a4_width / original_width
                scale_y = a4_height / original_height
                scale = min(scale_x, scale_y)
                new_width = original_width * scale
                new_height = original_height * scale
                offset_x = (a4_width - new_width) / 2
                offset_y = (a4_height - new_height) / 2
                transformation = Transformation().scale(scale, scale).translate(offset_x, offset_y)
                page.add_transformation(transformation)
                page.mediabox.lower_left = (0, 0)
                page.mediabox.upper_right = (a4_width, a4_height)
                output_pdf.add_page(page)

            with open(output_path, "wb") as f_out:
                output_pdf.write(f_out)
        return scale, offset_x, offset_y
    except Exception as e:
        print(f"PDF 리사이즈 중 오류 발생: {str(e)}")
        raise e

def fill_pdf_with_data(template_path, output_path, data):
    try:
        resized_template_path = template_path.replace('.pdf', '_resized.pdf')
        scale, offset_x, offset_y = resize_pdf_to_a4(template_path, resized_template_path)
        packet = BytesIO()
        c = canvas.Canvas(packet, pagesize=A4)
        c.setFont(font_name, 12)

        # 좌표 변환 함수
        def adjust_coords(x, y):
            return x * scale + offset_x, y * scale + offset_y

        # 좌표 및 필드명(두 번째 코드 기준)
        x1, y1 = adjust_coords(170, 870)
        c.drawString(x1, y1, f"{data.get('applicantName', '')}")

        x2, y2 = adjust_coords(170, 840)
        c.drawString(x2, y2, f"{data.get('applicantAddress', '')}")

        x3, y3 = adjust_coords(170, 810)
        c.drawString(x3, y3, f"{data.get('applicantContact', '')}")

        x4, y4 = adjust_coords(170, 725)
        c.drawString(x4, y4, f"{data.get('puchaserName', '')}")

        x5, y5 = adjust_coords(170, 705)
        c.drawString(x5, y5, f"{data.get('pushaserContact', '')}")

        x6, y6 = adjust_coords(310, 530)
        c.drawString(x6, y6, f"{data.get('destination', '')}")

        x7, y7 = adjust_coords(570, 855)
        c.drawString(x7, y7, f"{data.get('invoiceDate', '')}")

        x8, y8 = adjust_coords(60, 375)
        c.drawString(x8, y8, f"{data.get('vehicleName', '')}")

        x9, y9 = adjust_coords(260, 375)
        c.drawString(x9, y9, f"{data.get('vehicleYear', '')}")

        x10, y10 = adjust_coords(310, 375)
        c.drawString(x10, y10, f"{data.get('vehicleId', '')}")

        x11, y11 = adjust_coords(550, 375)
        c.drawString(x11, y11, f"{data.get('unitPrice', '')}")

        x12, y12 = adjust_coords(700, 375)
        c.drawString(x12, y12, f"{data.get('vehicleWeight', '')}")

        c.save()
        packet.seek(0)
        overlay_pdf = PdfReader(packet)

        with open(resized_template_path, "rb") as template_file:
            template_pdf = PdfReader(template_file)
            output_pdf = PdfWriter()
            base_page = template_pdf.pages[0]
            overlay_page = overlay_pdf.pages[0]
            base_page.merge_page(overlay_page)
            output_pdf.add_page(base_page)
            with open(output_path, "wb") as f_out:
                output_pdf.write(f_out)

        if os.path.exists(resized_template_path):
            os.remove(resized_template_path)
        print(f"PDF 파일이 성공적으로 생성되었습니다: {output_path}")

    except Exception as e:
        print(f"PDF 생성 중 오류 발생: {str(e)}")
        raise e

def generate_deregistration(template_path, output_path, data):
    """말소 신청서 PDF 생성 함수"""
    return fill_pdf_with_data(template_path, output_path, data)
