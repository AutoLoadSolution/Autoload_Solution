/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CancelManage extends Component {
    static template = "AutoloadSolution.CancelManage";
}

registry.category("actions").add("AutoloadSolution.cancel_manage", CancelManage); 