from odoo import http
from odoo.http import request


class MyAppController(http.Controller):
    
    @http.route('/my_app/hello', type='http', auth='public', website=True)
    def hello_world(self, **kwargs):
        return """
        <html>
            <head>
                <title>내 앱 환영</title>
            </head>
            <body>
                <h1>안녕하세요! 내 Odoo 앱에 오신 것을 환영합니다!</h1>
                <p>이 페이지는 커스텀 컨트롤러로 생성되었습니다.</p>
            </body>
        </html>
        """
    
    @http.route('/my_app/data', type='json', auth='user')
    def get_data(self, **kwargs):
        """JSON API 엔드포인트 예시"""
        records = request.env['my.model'].search([])
        return {
            'success': True,
            'data': [{
                'id': record.id,
                'name': record.name,
                'state': record.state
            } for record in records]
        } 