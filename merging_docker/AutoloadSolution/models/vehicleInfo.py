from odoo import models, fields


class VehicleInfo(models.Model):
    _name = 'autoloadsolution.vehicleinfo'
    _description = 'Vehicle Info (차량 상세 정보)'

    cancellation_id = fields.Many2one(
        'autoloadsolution.cancellation', string="말소 참조", required=False, ondelete='set null')
    
    vehicle_id = fields.Char(string="차량 ID", required=True)
    vehicle_name = fields.Char(string="차량명", required=True)
    vehicle_year = fields.Integer(string="연식")
    quantity = fields.Integer(string="수량")
    unit_price = fields.Float(string="단가")
    sales_amount = fields.Float(string="총금액")
    vehicle_weight = fields.Float(string="차량 중량")
    cbm = fields.Float(string="CBM")
