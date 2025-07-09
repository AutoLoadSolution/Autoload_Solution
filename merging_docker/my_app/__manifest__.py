{
    "name": "My Application",
    "version": "1.0.0",
    "summary": "내 커스텀 Odoo 애플리케이션",
    "category": "Productivity",
    "sequence": 10,
    "description": """
        이 모듈은 내 커스텀 비즈니스 로직을 구현합니다.
        필요한 기능들을 추가하여 사용할 수 있습니다.
    """,
    "author": "My Company",
    "website": "https://www.mycompany.com",
    "icon": "/my_app/static/description/icon.png",
    "depends": ["base", "web"],
    "data": [
        "views/views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "my_app/static/src/**/*",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "license": "LGPL-3",
} 