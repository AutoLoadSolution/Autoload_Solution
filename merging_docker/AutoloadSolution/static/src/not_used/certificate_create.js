/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

class CertificateCreate extends Component {
    static template = "AutoloadSolution.CertificateCreate";

    setup() {
        this.router = useService("router");
        this.notification = useService("notification");
        
        // useState를 사용하여 반응형 상태 관리
        this.state = useState({
            formData: {
                date: "",
                invoiceNo: "",
                client: "",
                warehouse: "",
                transactionType: "",
                transactionCondition: "",
                buyerName: "",
                buyerNumber: "",
                buyerAddress: "",
                rorocon: "",
                containerNumber: "",
                importCode: "",
                exportDeclarationNumber: "",
                loadingPort: "",
                destinationCountry: "",
                fobcfr: "",
                departure: "",
                exportAmount: "",
                freightCost: "",
                insurance: "",
            }
        });
    }

    /**
     * 뒤로가기 버튼 클릭 핸들러
     */
    goBack() {
        this.router.back();
    }

    /**
     * 사진 등록 버튼 클릭 핸들러
     */
    handlePhotoRegistration() {
        this.notification.add("면장 사진 등록 기능을 실행합니다.", {
            type: "info",
        });
    }

    /**
     * 폼 제출 핸들러
     */
    handleSubmit(ev) {
        ev.preventDefault();
        
        // 필수 필드 검증
        const requiredFields = ['date', 'invoiceNo', 'client', 'warehouse', 'transactionType'];
        const missingFields = requiredFields.filter(field => !this.state.formData[field]);
        
        if (missingFields.length > 0) {
            this.notification.add("필수 항목을 모두 입력해주세요.", {
                type: "warning",
            });
            return;
        }

        // 면장 데이터 저장 로직
        console.log("면장 데이터 저장:", this.state.formData);
        
        this.notification.add("면장 정보가 저장되었습니다.", {
            type: "success",
        });

        // 면장 목록 페이지로 이동
        this.router.navigate({ to: "/web#action=AutoloadSolution.certificate_manage" });
    }

    /**
     * 폼 초기화 핸들러
     */
    resetForm() {
        this.state.formData = {
            date: "",
            invoiceNo: "",
            client: "",
            warehouse: "",
            transactionType: "",
            transactionCondition: "",
            buyerName: "",
            buyerNumber: "",
            buyerAddress: "",
            rorocon: "",
            containerNumber: "",
            importCode: "",
            exportDeclarationNumber: "",
            loadingPort: "",
            destinationCountry: "",
            fobcfr: "",
            departure: "",
            exportAmount: "",
            freightCost: "",
            insurance: "",
        };
        
        this.notification.add("폼이 초기화되었습니다.", {
            type: "info",
        });
    }

    /**
     * 입력 필드 변경 핸들러
     */
    handleInputChange(field, value) {
        this.state.formData[field] = value;
    }
}

registry.category("actions").add("AutoloadSolution.certificate_create", CertificateCreate); 