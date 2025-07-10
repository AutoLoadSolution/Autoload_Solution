/** @odoo-module **/

import { Component, useState, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";

// 샘플 데이터 타입 정의
const sampleData = [
    {
        id: "M001",
        date: "2024-01-15",
        vehicleNumber: "12가3456",
        ownerName: "김철수",
        mileage: 45000,
        address: "서울시 강남구 테헤란로 123",
        fuelType: "가솔린",
        vehicleWeight: 1500,
        dealer: "현대자동차",
        chassisNumber: "KMHD123456789",
        warehouse: "서울창고",
        category: "승용차",
        status: "완료",
    },
    {
        id: "M002",
        date: "2024-01-16",
        vehicleNumber: "34나7890",
        ownerName: "이영희",
        mileage: 32000,
        address: "부산시 해운대구 센텀로 456",
        fuelType: "디젤",
        vehicleWeight: 2000,
        dealer: "기아자동차",
        chassisNumber: "KNHD987654321",
        warehouse: "부산창고",
        category: "SUV",
        status: "진행중",
    },
    {
        id: "M003",
        date: "2024-01-17",
        vehicleNumber: "56다1234",
        ownerName: "박민수",
        mileage: 78000,
        address: "대구시 중구 동성로 789",
        fuelType: "LPG",
        vehicleWeight: 1300,
        dealer: "쌍용자동차",
        chassisNumber: "SYHD456789123",
        warehouse: "대구창고",
        category: "승용차",
        status: "대기",
    },
    {
        id: "M004",
        date: "2024-01-18",
        vehicleNumber: "78라5678",
        ownerName: "정수진",
        mileage: 25000,
        address: "광주시 서구 상무대로 321",
        fuelType: "하이브리드",
        vehicleWeight: 1600,
        dealer: "토요타",
        chassisNumber: "TYHD789123456",
        warehouse: "광주창고",
        category: "하이브리드",
        status: "완료",
    },
    {
        id: "M005",
        date: "2024-01-19",
        vehicleNumber: "90마9012",
        ownerName: "최동훈",
        mileage: 55000,
        address: "인천시 연수구 송도대로 654",
        fuelType: "전기",
        vehicleWeight: 1800,
        dealer: "테슬라",
        chassisNumber: "TSHD123789456",
        warehouse: "인천창고",
        category: "전기차",
        status: "진행중",
    },
];

class CancelManage extends Component {
    static template = "AutoloadSolution.CancelManage";

    setup() {
        this.state = useState({
            dateFrom: "",
            dateTo: "",
            warehouse: "",
            dealer: "",
            category: "",
            searchTerm: "",
            sortKey: "date",
            sortDir: "desc",
        });
    }

    // XML에서 사용할 getter들
    get data() {
        return sampleData;
    }

    get filteredData() {
        return this.data.filter((item) => {
            const matchesDateRange =
                (!this.state.dateFrom || item.date >= this.state.dateFrom) &&
                (!this.state.dateTo || item.date <= this.state.dateTo);
            const matchesWarehouse =
                !this.state.warehouse || this.state.warehouse === "" || this.state.warehouse === "all" || item.warehouse === this.state.warehouse;
            const matchesDealer =
                !this.state.dealer || this.state.dealer === "" || this.state.dealer === "all" || item.dealer === this.state.dealer;
            const matchesCategory =
                !this.state.category || this.state.category === "" || this.state.category === "all" || item.category === this.state.category;
            const matchesSearchTerm =
                !this.state.searchTerm ||
                item.vehicleNumber.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                item.ownerName.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
                item.chassisNumber.toLowerCase().includes(this.state.searchTerm.toLowerCase());
            return matchesDateRange && matchesWarehouse && matchesDealer && matchesCategory && matchesSearchTerm;
        });
    }

    get sortedData() {
        const sorted = [...this.filteredData].sort((a, b) => {
            const aValue = a[this.state.sortKey];
            const bValue = b[this.state.sortKey];
            if (typeof aValue === "string" && typeof bValue === "string") {
                return this.state.sortDir === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
                return this.state.sortDir === "asc" ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
        return sorted;
    }

    // XML에서 사용할 메서드들
    handleInputChange(field, value) {
        this.state[field] = value;
    }

    handleSort(key) {
        if (this.state.sortKey === key) {
            this.state.sortDir = this.state.sortDir === "asc" ? "desc" : "asc";
        } else {
            this.state.sortKey = key;
            this.state.sortDir = "asc";
        }
    }

    handleReset() {
        this.state.dateFrom = "";
        this.state.dateTo = "";
        this.state.warehouse = "";
        this.state.dealer = "";
        this.state.category = "";
        this.state.searchTerm = "";
    }

    handleIssueCertificate(item) {
        alert(`${item.vehicleNumber} (${item.ownerName})의 자동차말소등록신청서를 발급합니다.`);
    }
}

registry.category("actions").add("AutoloadSolution.cancel_manage", CancelManage); 