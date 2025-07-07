from odoo import models, fields, api, _
from odoo.exceptions import ValidationError


class MyModel(models.Model):
    _name = 'my.model'
    _description = '내 커스텀 모델'
    _rec_name = 'name'

    name = fields.Char(string='이름', required=True)
    description = fields.Text(string='설명')
    active = fields.Boolean(string='활성', default=True)
    date_created = fields.Datetime(string='생성일', default=fields.Datetime.now)
    
    # 관계 필드 예시
    partner_id = fields.Many2one('res.partner', string='파트너')
    
    # 상태 필드 예시
    state = fields.Selection([
        ('draft', '초안'),
        ('confirmed', '확인됨'),
        ('done', '완료')
    ], string='상태', default='draft', required=True)
    
    @api.constrains('name')
    def _check_name(self):
        for record in self:
            if len(record.name) < 3:
                raise ValidationError(_('이름은 최소 3자 이상이어야 합니다.'))
    
    def action_confirm(self):
        self.ensure_one()
        self.state = 'confirmed'
    
    def action_done(self):
        self.ensure_one()
        self.state = 'done'
    
    def action_draft(self):
        self.ensure_one()
        self.state = 'draft' 