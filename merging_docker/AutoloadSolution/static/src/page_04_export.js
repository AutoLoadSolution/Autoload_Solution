/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";

class Export extends Component {
    static template = "AutoloadSolution.Page04Export";

    setup() {
        this.state = {
            exportData: [],
            isLoading: false,
            searchTerm: "",
            selectedType: "all",
            selectedStatus: "all"
        };
        
        this.loadExportData();
    }

    // 수출 데이터 로드
    loadExportData() {
        this.state.isLoading = true;
        
        // localStorage에서 수출 데이터 로드
        const storedData = localStorage.getItem('exportData');
        if (storedData) {
            try {
                this.state.exportData = JSON.parse(storedData);
            } catch (error) {
                this.state.exportData = [];
            }
        }
        
        this.state.isLoading = false;
    }

    // 검색어 변경
    handleSearchChange(ev) {
        this.state.searchTerm = ev.target.value;
    }

    // 수출 타입 필터 변경
    handleTypeChange(ev) {
        this.state.selectedType = ev.target.value;
    }

    // 상태 필터 변경
    handleStatusChange(ev) {
        this.state.selectedStatus = ev.target.value;
    }

    // 필터링된 데이터
    get filteredData() {
        let filtered = this.state.exportData;
        
        // 검색어 필터
        if (this.state.searchTerm) {
            const searchLower = this.state.searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                item.exportNumber?.toLowerCase().includes(searchLower) ||
                item.customerName?.toLowerCase().includes(searchLower) ||
                item.productName?.toLowerCase().includes(searchLower)
            );
        }
        
        // 타입 필터
        if (this.state.selectedType !== "all") {
            filtered = filtered.filter(item => item.exportType === this.state.selectedType);
        }
        
        // 상태 필터
        if (this.state.selectedStatus !== "all") {
            filtered = filtered.filter(item => item.status === this.state.selectedStatus);
        }
        
        return filtered;
    }

    // 수출 신청 페이지로 이동
    navigateToCreate() {
        this.env.services.action.doAction("AutoloadSolution.export_create");
    }

    // 수출 상세 보기
    viewExportDetail(exportId) {
        // 상세 보기 로직
        console.log('수출 상세 보기:', exportId);
    }

    // 수출 삭제
    deleteExport(exportId) {
        if (confirm('정말로 이 수출을 삭제하시겠습니까?')) {
            this.state.exportData = this.state.exportData.filter(item => item.id !== exportId);
            localStorage.setItem('exportData', JSON.stringify(this.state.exportData));
        }
    }

    // 수출 타입 텍스트 변환
    getExportTypeText(type) {
        const typeMap = {
            'vehicle': '차량',
            'parts': '부품',
            'machinery': '기계',
            'other': '기타'
        };
        return typeMap[type] || type;
    }

    // 상태 텍스트 변환
    getStatusText(status) {
        const statusMap = {
            'pending': '대기중',
            'approved': '승인됨',
            'shipped': '선적완료',
            'delivered': '인도완료',
            'cancelled': '취소'
        };
        return statusMap[status] || status;
    }

    // 상태별 CSS 클래스
    getStatusClass(status) {
        const classMap = {
            'pending': 'status-pending',
            'approved': 'status-approved',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return classMap[status] || '';
    }

    // 엑셀 다운로드
    downloadExcel() {
        const data = this.filteredData;
        if (data.length === 0) {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        // CSV 형식으로 데이터 변환
        const headers = ['수출번호', '고객명', '제품명', '수출타입', '수량', '금액', '상태', '수출일자'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.exportNumber,
                item.customerName,
                item.productName,
                this.getExportTypeText(item.exportType),
                item.quantity,
                item.amount,
                this.getStatusText(item.status),
                item.exportDate
            ].join(','))
        ].join('\n');

        // 파일 다운로드
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `수출데이터_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

registry.category("actions").add("AutoloadSolution.export", Export); 