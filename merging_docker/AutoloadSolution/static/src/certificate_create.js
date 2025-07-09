/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CertificateCreate extends Component {
    static template = "AutoloadSolution.CertificateCreate";
}

registry.category("actions").add("AutoloadSolution.certificate_create", CertificateCreate); 