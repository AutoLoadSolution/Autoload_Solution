/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CertificateManage extends Component {
    static template = "AutoloadSolution.CertificateManage";
}

registry.category("actions").add("AutoloadSolution.certificate_manage", CertificateManage); 