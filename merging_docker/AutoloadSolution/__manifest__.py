{
    "name": "AutoloadSolution",
    "version": "1.0.0",
    "summary": "AutoloadSolution",
    "category": "Productivity",
    "sequence": 10,
    "description": """
        AutoloadSolution
    """,
    "author": "AutoloadSolution",
    "website": "https://www.autoloadsolution.com",
    "icon": "/AutoloadSolution/static/description/icon.png",
    "depends": ["base", "web"],
    "data": [
        'security/ir.model.access.csv',
        "views/views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "AutoloadSolution/static/src/page_01_cancel_create.js",
            "AutoloadSolution/static/src/page_01_cancel_create.xml",
            "AutoloadSolution/static/src/page_01_cancel_create.css",
            "AutoloadSolution/static/src/page_02_cancel_manage.js",
            "AutoloadSolution/static/src/page_02_cancel_manage.xml",
            "AutoloadSolution/static/src/page_02_cancel_manage.css",
            "AutoloadSolution/static/src/page_03_shipping_manage.js",
            "AutoloadSolution/static/src/page_03_shipping_manage.xml",
            "AutoloadSolution/static/src/page_03_shipping_manage.css",
            "AutoloadSolution/static/src/page_04_export.js",
            "AutoloadSolution/static/src/page_04_export.xml",
            "AutoloadSolution/static/src/page_04_export.css",
        ],
        # "web.assets_qweb" : [
        #     "AutoloadSolution/static/src/page_01_cancel_create.xml",
        # ]
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "license": "LGPL-3",
} 