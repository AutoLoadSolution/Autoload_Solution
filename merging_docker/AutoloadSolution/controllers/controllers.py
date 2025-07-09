from odoo import http
from odoo.http import request


class AutoloadSolutionController(http.Controller):
    
    @http.route('/AutoloadSolution/hello', type='http', auth='public', website=True)
    def hello_world(self, **kwargs):
        return """
        <html>
            <head>
                <title>AutoloadSolution 환영</title>
            </head>
            <body>
                <h1>안녕하세요! AutoloadSolution Odoo 앱에 오신 것을 환영합니다!</h1>
                <p>이 페이지는 커스텀 컨트롤러로 생성되었습니다.</p>
            </body>
        </html>
        """
    
    @http.route('/AutoloadSolution/data', type='json', auth='user')
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