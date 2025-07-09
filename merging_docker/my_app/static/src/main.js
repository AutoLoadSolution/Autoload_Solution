/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

class MyAppMain extends Component {
    static template = "my_app.MyAppMain";
}

registry.category("actions").add("my_app.main", MyAppMain); 