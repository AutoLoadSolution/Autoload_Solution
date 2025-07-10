/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CertificateManage extends Component {
    static template = "AutoloadSolution.CertificateManage";

    setup() {
        // 목 데이터
        this.mockExemptionData = [
            {
                id: "1",
                date: "2024-01-15",
                invoiceNo: "INV-2024-001",
                client: "현대자동차",
                warehouse: "부산항 1창고",
                transactionType: "수출",
                transactionCondition: "FOB",
                buyerName: "ABC Motors",
                buyerNumber: "BUY-001",
                buyerAddress: "123 Main St, USA",
                rorocon: "RORO",
                containerNumber: "CONT-001",
                importCode: "IMP-001",
                exportDeclarationNumber: "EXP-2024-001",
                loadingPort: "부산항",
                destinationCountry: "미국",
                fobcfr: "FOB",
                departure: "부산",
                exportAmount: "50,000",
                freightCost: "3,000",
                insurance: "500",
            },
            {
                id: "2",
                date: "2024-01-16",
                invoiceNo: "INV-2024-002",
                client: "기아자동차",
                warehouse: "인천항 2창고",
                transactionType: "수출",
                transactionCondition: "CFR",
                buyerName: "XYZ Trading",
                buyerNumber: "BUY-002",
                buyerAddress: "456 Oak Ave, Canada",
                rorocon: "CON",
                containerNumber: "CONT-002",
                importCode: "IMP-002",
                exportDeclarationNumber: "EXP-2024-002",
                loadingPort: "인천항",
                destinationCountry: "캐나다",
                fobcfr: "CFR",
                departure: "인천",
                exportAmount: "75,000",
                freightCost: "4,500",
                insurance: "750",
            },
            {
                id: "3",
                date: "2024-01-17",
                invoiceNo: "INV-2024-003",
                client: "삼성전자",
                warehouse: "울산항 3창고",
                transactionType: "수출",
                transactionCondition: "CIF",
                buyerName: "Global Electronics",
                buyerNumber: "BUY-003",
                buyerAddress: "789 Tech Blvd, Germany",
                rorocon: "CON",
                containerNumber: "CONT-003",
                importCode: "IMP-003",
                exportDeclarationNumber: "EXP-2024-003",
                loadingPort: "울산항",
                destinationCountry: "독일",
                fobcfr: "CIF",
                departure: "울산",
                exportAmount: "120,000",
                freightCost: "6,000",
                insurance: "1,200",
            },
        ];

        // useState를 사용하여 반응형 상태 관리
        this.state = useState({
            searchCriteria: {
                startDate: "",
                endDate: "",
                invoiceNo: "",
                transactionType: "",
                warehouse: "",
                client: "",
                item: "",
                type: "",
                directSearch: "",
            },
            filteredData: this.mockExemptionData,
            selectedItems: [],
        });
    }

    // 검색 조건 입력 처리
    handleSearchInputChange(field, value) {
        this.state.searchCriteria[field] = value;
    }

    // 검색 실행
    handleSearch() {
        let filtered = this.mockExemptionData;

        // 날짜 범위 필터링
        if (this.state.searchCriteria.startDate && this.state.searchCriteria.endDate) {
            filtered = filtered.filter((item) => 
                item.date >= this.state.searchCriteria.startDate && 
                item.date <= this.state.searchCriteria.endDate
            );
        }

        // Invoice No 필터링
        if (this.state.searchCriteria.invoiceNo) {
            filtered = filtered.filter((item) =>
                item.invoiceNo.toLowerCase().includes(this.state.searchCriteria.invoiceNo.toLowerCase())
            );
        }

        // 거래유형 필터링
        if (this.state.searchCriteria.transactionType) {
            filtered = filtered.filter((item) => 
                item.transactionType === this.state.searchCriteria.transactionType
            );
        }

        // 창고 필터링
        if (this.state.searchCriteria.warehouse) {
            filtered = filtered.filter((item) =>
                item.warehouse.toLowerCase().includes(this.state.searchCriteria.warehouse.toLowerCase())
            );
        }

        // 거래처 필터링
        if (this.state.searchCriteria.client) {
            filtered = filtered.filter((item) =>
                item.client.toLowerCase().includes(this.state.searchCriteria.client.toLowerCase())
            );
        }

        // 직접검색 필터링
        if (this.state.searchCriteria.directSearch) {
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value.toString().toLowerCase().includes(this.state.searchCriteria.directSearch.toLowerCase())
                )
            );
        }

        this.state.filteredData = filtered;
        this.state.selectedItems = []; // 검색 시 선택 항목 초기화
    }

    // 개별 항목 선택/해제
    handleSelectItem(itemId) {
        if (this.state.selectedItems.includes(itemId)) {
            this.state.selectedItems = this.state.selectedItems.filter(id => id !== itemId);
        } else {
            this.state.selectedItems = [...this.state.selectedItems, itemId];
        }
    }

    // 전체 선택/해제
    handleSelectAll() {
        if (this.state.selectedItems.length === this.state.filteredData.length) {
            this.state.selectedItems = [];
        } else {
            this.state.selectedItems = this.state.filteredData.map(item => item.id);
        }
    }

    // 관세사에게 전송
    handleSendToCustomsBroker() {
        const selectedData = this.state.filteredData.filter(item => 
            this.state.selectedItems.includes(item.id)
        );
        console.log("관세사님께 보낼 데이터:", selectedData);
        alert(`${this.state.selectedItems.length}건의 면장 데이터를 관세사님께 전송했습니다.`);
    }

    // 사진으로 업로드하기
    handlePhotoRegistration() {
        console.log("사진으로 업로드하기 기능 실행");
        alert("사진으로 업로드하기 기능이 실행됩니다.");
    }

    // 면장 입력 페이지로 이동
    handleCreateCertificate() {
        // Odoo 액션으로 면장 입력 페이지로 이동
        this.env.services.action.doAction({
            type: 'ir.actions.client',
            tag: 'AutoloadSolution.certificate_create',
        });
    }
}

registry.category("actions").add("AutoloadSolution.certificate_manage", CertificateManage); 