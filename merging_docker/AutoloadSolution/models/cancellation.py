from odoo import models, fields


class Cancellation(models.Model):
    _name = 'autoloadsolution.cancellation'
    _description = 'Vehicle Cancellation (말소 등록)'

    owner_name = fields.Char(string="소유자명", required=True)
    ssn = fields.Char(string="주민등록번호", required=True)
    address = fields.Text(string="주소")
    email = fields.Char(string="이메일")
    phone_number = fields.Char(string="전화번호")
    registration_no = fields.Char(string="등록번호", required=True)
    vehicle_id = fields.Char(string="차량 ID", required=True)
    mileage = fields.Integer(string="주행거리")

    # 이후 단계에서 추가될 항목
    destination = fields.Char(string="도착지")
    invoice_date = fields.Date(string="선적 예정일")
    is_checked = fields.Boolean(string="검수 여부", default=False)
    buyer_name = fields.Char(string="구매자")
    buyer_contact = fields.Char(string="구매자 연락처")

    vehicleinfo_ids = fields.One2many(
        'autoloadsolution.vehicleinfo', 'cancellation_id', string="차량 정보")

    _sql_constraints = [
        ('vehicle_id_unique', 'unique(vehicle_id)', '이미 등록된 차대번호입니다.')
    ]
