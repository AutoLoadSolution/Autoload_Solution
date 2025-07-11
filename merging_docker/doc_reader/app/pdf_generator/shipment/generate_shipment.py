from PyPDF2 import PdfReader, PdfWriter, Transformation
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from io import BytesIO
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
pdf_generator_dir = os.path.abspath(os.path.join(current_dir, ".."))
font_path = os.path.join(pdf_generator_dir, "font", "AppleSDGothicNeoSB.ttf")
pdfmetrics.registerFont(TTFont('AppleGothic', font_path))

def resize_pdf_to_a4(template_path, output_path):
    try:
        with open(template_path, "rb") as template_file:
            template_pdf = PdfReader(template_file)
            output_pdf = PdfWriter()
            
            # A4 크기 (595.27 x 841.89 points)
            a4_width, a4_height = A4
            
            for page in template_pdf.pages:
                original_width = float(page.mediabox.width)
                original_height = float(page.mediabox.height)
                
                # print(f"원본 크기: {original_width} x {original_height}")
                # print(f"A4 크기: {a4_width} x {a4_height}")
                
                # 스케일 비율 계산 (A4에 맞추되, 비율 유지)
                scale_x = a4_width / original_width
                scale_y = a4_height / original_height
                scale = min(scale_x, scale_y)  # 작은 값을 사용하여 비율 유지
                
                # print(f"스케일 비율: {scale}")
                
                # 새로운 크기 계산
                new_width = original_width * scale
                new_height = original_height * scale
                
                offset_x = (a4_width - new_width) / 2
                offset_y = (a4_height - new_height) / 2
                
                # 변환 매트릭스 적용
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
        # 먼저 템플릿을 A4 크기로 리사이즈
        resized_template_path = template_path.replace('.pdf', '_resized.pdf')
        scale, offset_x, offset_y = resize_pdf_to_a4(template_path, resized_template_path)
        
        # 1. 메모리 캔버스 생성
        packet = BytesIO()
        c = canvas.Canvas(packet, pagesize=A4)
        c.setFont("AppleGothic", 12)
        
        # 스케일과 오프셋을 적용한 좌표 계산
        def adjust_coords(x, y):
            return x * scale + offset_x, y * scale + offset_y
        
        # 조정된 좌표로 텍스트 그리기
        x1, y1 = adjust_coords(130, 713)
        c.drawString(x1, y1, f"{data.get('applicantName', '')}")
        
        x2, y2 = adjust_coords(70, 700)
        c.drawString(x2, y2, f"{data.get('applicantAddress', '')}")
        
        # x3, y3 = adjust_coords(70, 640)
        # c.drawString(x3, y3, f"{data.get('applicantContact', '')}")
        
        x4, y4 = adjust_coords(130, 660)
        c.drawString(x4, y4, f"{data.get('puchaserName', '')}")
        
        x5, y5 = adjust_coords(400, 668)
        c.drawString(x5, y5, f"{data.get('buyerName', '')}")
        
        x6, y6 = adjust_coords(185, 625)
        c.drawString(x6, y6, f"{data.get('destination', '')}")

        # x7, y7 = adjust_coords(420, 715)
        # c.drawString(x7, y7, f"{data.get('invoiceDate', '')}")
        
        x8, y8 = adjust_coords(80, 555)
        c.drawString(x8, y8, f"{data.get('vehicleName', '')}")

        x9, y9 = adjust_coords(145, 555)
        c.drawString(x9, y9, f"{data.get('vehicleYear', '')}")

        x10, y10 = adjust_coords(180, 555)
        c.drawString(x10, y10, f"{data.get('vehicleId', '')}")

        x11, y11 = adjust_coords(320, 555)
        c.drawString(x11, y11, f"{data.get('quantity', '')}")

        x12, y12 = adjust_coords(345, 555)
        c.drawString(x12, y12, f"{data.get('unitPrice', '')}")

        x13, y13 = adjust_coords(415, 555)
        c.drawString(x13, y13, f"{data.get('salesAmount', '')}")

        x14, y14 = adjust_coords(490, 555)
        c.drawString(x14, y14, f"{data.get('vehicleWeight', '')}")

        x15, y15 = adjust_coords(345,380)
        c.drawString(x15, y15, f"{data.get('salesAmount', '')}")

        x18, y18 = adjust_coords(415,380)
        c.drawString(x18, y18, f"{data.get('salesAmount', '')}")

        x16, y16 = adjust_coords(320, 380)
        c.drawString(x16, y16, f"{data.get('quantity', '')}")

        x17, y17 = adjust_coords(490, 380)
        c.drawString(x17, y17, f"{data.get('vehicleWeight', '')}")



        c.save()

        # 2. 기존 PDF와 병합
        packet.seek(0)
        overlay_pdf = PdfReader(packet)
        
        # 리사이즈된 템플릿 파일 읽기
        with open(resized_template_path, "rb") as template_file:
            template_pdf = PdfReader(template_file)
            output_pdf = PdfWriter()

            # 페이지 병합
            base_page = template_pdf.pages[0]
            overlay_page = overlay_pdf.pages[0]
            base_page.merge_page(overlay_page)
            output_pdf.add_page(base_page)

            # 3. 최종 PDF 저장
            with open(output_path, "wb") as f_out:
                output_pdf.write(f_out)
        
        # 임시 파일 삭제
        os.remove(resized_template_path)
                
        print(f"PDF 파일이 성공적으로 생성되었습니다: {output_path}")
        
    except Exception as e:
        print(f"PDF 생성 중 오류 발생: {str(e)}")
        raise e
    

def generate_shipment(template_path, output_path, data):
    """roro PDF 생성 함수"""
    return fill_pdf_with_data(template_path, output_path, data)
    
