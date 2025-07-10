/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CancelCreate extends Component {
    static template = "AutoloadSolution.CancelCreate";
    
    setup() {
        this.state = useState({
            date: "",
            vehicleNumber: "",
            ownerName: "",
            mileage: "",
            address: "",
            fuelType: "",
            vehicleWeight: "",
            dealer: "",
            chassisNumber: "",
            residentNumberFront: "",
            residentNumberBack: "",
            uploadedImage: null,
            currentPage: "inquiry",
        });
    }

    handleInputChange(field, value) {
        this.state[field] = value;
    }

    handleResidentNumberFront(value) {
        // 숫자만 입력 가능
        const numericValue = value.replace(/[^0-9]/g, '');
        this.state.residentNumberFront = numericValue;
    }

    handleResidentNumberBack(value) {
        // 숫자만 입력 가능
        const numericValue = value.replace(/[^0-9]/g, '');
        this.state.residentNumberBack = numericValue;
    }

    handleSubmit(ev) {
        ev.preventDefault();
        
        // 말소 데이터 생성
        const cancelData = {
            id: this.generateId(),
            date: this.state.date,
            vehicleNumber: this.state.vehicleNumber,
            ownerName: this.state.ownerName,
            mileage: parseInt(this.state.mileage) || 0,
            address: this.state.address,
            fuelType: this.getFuelTypeText(this.state.fuelType),
            vehicleWeight: parseInt(this.state.vehicleWeight) || 0,
            dealer: this.state.dealer,
            chassisNumber: this.state.chassisNumber,
            residentNumber: `${this.state.residentNumberFront}-${this.state.residentNumberBack}`,
            warehouse: this.getWarehouseByDealer(this.state.dealer),
            category: this.getCategoryByFuelType(this.state.fuelType),
            status: "대기",
            createdAt: new Date().toISOString(),
        };

        // 로컬 스토리지에서 기존 데이터 가져오기
        const existingData = JSON.parse(localStorage.getItem('cancelData') || '[]');
        
        // 새 데이터 추가
        existingData.push(cancelData);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('cancelData', JSON.stringify(existingData));
        
        console.log("말소 데이터 저장:", cancelData);
        alert("말소 정보가 저장되었습니다. 관리 페이지로 이동합니다.");
        
        // cancel_manage 페이지로 이동
        this.navigateToManage();
    }

    generateId() {
        const random = Math.floor(Math.random() * 9999);
        // 매우 짧은 ID 생성 (M + 3자리 숫자)
        const shortId = `M${String(random).padStart(3, '0')}`;
        return shortId;
    }

    getFuelTypeText(fuelType) {
        const fuelTypeMap = {
            'gasoline': '가솔린',
            'diesel': '디젤',
            'lpg': 'LPG',
            'hybrid': '하이브리드',
            'electric': '전기',
            'other': '기타'
        };
        return fuelTypeMap[fuelType] || fuelType;
    }

    getWarehouseByDealer(dealer) {
        const warehouseMap = {
            '현대자동차': '서울창고',
            '기아자동차': '부산창고',
            '쌍용자동차': '대구창고',
            '토요타': '광주창고',
            '테슬라': '인천창고'
        };
        return warehouseMap[dealer] || '서울창고';
    }

    getCategoryByFuelType(fuelType) {
        const categoryMap = {
            'gasoline': '승용차',
            'diesel': 'SUV',
            'lpg': '승용차',
            'hybrid': '하이브리드',
            'electric': '전기차',
            'other': '승용차'
        };
        return categoryMap[fuelType] || '승용차';
    }

    navigateToManage() {
        // Odoo의 액션 시스템을 사용하여 페이지 이동
        const action = {
            type: 'ir.actions.client',
            tag: 'AutoloadSolution.cancel_manage'
        };
        
        // 현재 환경에서 액션 실행
        if (this.env && this.env.services && this.env.services.action) {
            this.env.services.action.doAction(action);
        } else {
            // 대체 방법: URL 변경
            window.location.hash = '#cancel_manage';
            // 페이지 새로고침으로 강제 이동
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }

    handleReset() {
        this.state.date = "";
        this.state.vehicleNumber = "";
        this.state.ownerName = "";
        this.state.mileage = "";
        this.state.address = "";
        this.state.fuelType = "";
        this.state.vehicleWeight = "";
        this.state.dealer = "";
        this.state.chassisNumber = "";
        this.state.residentNumberFront = "";
        this.state.residentNumberBack = "";
        this.state.uploadedImage = null;
    }

    handleAddClick() {
        this.state.currentPage = "input";
    }

    handleBack() {
        this.state.currentPage = "inquiry";
    }

    handleImageUpload() {
        document.getElementById("imageUpload")?.click();
    }

    handleImageChange(ev) {
        const file = ev.target.files && ev.target.files[0];
        if (file) {
            this.state.uploadedImage = file;
            alert(`이미지가 업로드되었습니다: ${file.name}`);
        }
    }
}

registry.category("actions").add("AutoloadSolution.cancel_create", CancelCreate); 