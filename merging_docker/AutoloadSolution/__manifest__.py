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
            "AutoloadSolution/static/src/**/*",
        ],
    },
    "installable": True,
    "application": True,
    "auto_install": False,
    "license": "LGPL-3",
} 