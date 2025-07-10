/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";

class ShippingManage extends Component {
    static template = "AutoloadSolution.Page03ShippingManage";

    setup() {
        this.state = {
            shippingData: [],
            isLoading: false,
            searchTerm: "",
            selectedStatus: "all"
        };
        
        this.loadShippingData();
    }

    // 선적 데이터 로드
    loadShippingData() {
        this.state.isLoading = true;
        
        // localStorage에서 선적 데이터 로드
        const storedData = localStorage.getItem('shippingData');
        if (storedData) {
            try {
                this.state.shippingData = JSON.parse(storedData);
            } catch (error) {
                this.state.shippingData = [];
            }
        }
        
        this.state.isLoading = false;
    }

    // 검색어 변경
    handleSearchChange(ev) {
        this.state.searchTerm = ev.target.value;
    }

    // 상태 필터 변경
    handleStatusChange(ev) {
        this.state.selectedStatus = ev.target.value;
    }

    // 필터링된 데이터
    get filteredData() {
        let filtered = this.state.shippingData;
        
        // 검색어 필터
        if (this.state.searchTerm) {
            const searchLower = this.state.searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                item.shippingNumber?.toLowerCase().includes(searchLower) ||
                item.customerName?.toLowerCase().includes(searchLower) ||
                item.vehicleNumber?.toLowerCase().includes(searchLower)
            );
        }
        
        // 상태 필터
        if (this.state.selectedStatus !== "all") {
            filtered = filtered.filter(item => item.status === this.state.selectedStatus);
        }
        
        return filtered;
    }

    // 선적 신청 페이지로 이동
    navigateToCreate() {
        this.env.services.action.doAction("AutoloadSolution.shipping_create");
    }

    // 선적 상세 보기
    viewShippingDetail(shippingId) {
        // 상세 보기 로직
        console.log('선적 상세 보기:', shippingId);
    }

    // 선적 삭제
    deleteShipping(shippingId) {
        if (confirm('정말로 이 선적을 삭제하시겠습니까?')) {
            this.state.shippingData = this.state.shippingData.filter(item => item.id !== shippingId);
            localStorage.setItem('shippingData', JSON.stringify(this.state.shippingData));
        }
    }

    // 상태 텍스트 변환
    getStatusText(status) {
        const statusMap = {
            'pending': '대기중',
            'processing': '처리중',
            'completed': '완료',
            'cancelled': '취소'
        };
        return statusMap[status] || status;
    }

    // 상태별 CSS 클래스
    getStatusClass(status) {
        const classMap = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return classMap[status] || '';
    }
}

registry.category("actions").add("AutoloadSolution.shipping_manage", ShippingManage); 