/** @odoo-module **/

import { Component } from "@odoo/owl";
import { registry } from "@web/core/registry";

// 면장생성 컴포넌트
class CertificateCreate extends Component {
    static template = "AutoloadSolution.CertificateCreate";
}

// 면장관리 컴포넌트
class CertificateManage extends Component {
    static template = "AutoloadSolution.CertificateManage";
}

// 말소생성 컴포넌트
class CancelCreate extends Component {
    static template = "AutoloadSolution.CancelCreate";
}

// 말소관리 컴포넌트
class CancelManage extends Component {
    static template = "AutoloadSolution.CancelManage";
}

// 액션 등록
registry.category("actions").add("AutoloadSolution.certificate_create", CertificateCreate);
registry.category("actions").add("AutoloadSolution.certificate_manage", CertificateManage);
registry.category("actions").add("AutoloadSolution.cancel_create", CancelCreate);
registry.category("actions").add("AutoloadSolution.cancel_manage", CancelManage); 