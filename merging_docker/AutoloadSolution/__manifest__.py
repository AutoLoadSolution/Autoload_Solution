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
        "views/views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "AutoloadSolution/static/src/main.js",
            "AutoloadSolution/static/src/main.xml",
            "AutoloadSolution/static/src/certificate_create.js",
            "AutoloadSolution/static/src/certificate_create.xml",
            "AutoloadSolution/static/src/certificate_create.css",
            "AutoloadSolution/static/src/certificate_manage.js",
            "AutoloadSolution/static/src/certificate_manage.xml",
            "AutoloadSolution/static/src/certificate_manage.css",
            "AutoloadSolution/static/src/cancel_create.js",
            "AutoloadSolution/static/src/cancel_create.xml",
            "AutoloadSolution/static/src/cancel_create.css",
            "AutoloadSolution/static/src/cancel_manage.js",
            "AutoloadSolution/static/src/cancel_manage.xml",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "license": "LGPL-3",
} 