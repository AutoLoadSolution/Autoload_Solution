/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class ShippingManage extends Component {
    static template = "AutoloadSolution.Page03ShippingManage";
    
    setup() {
        this.state = useState({
            dateFrom: "",
            dateTo: "",
            status: "",
            ownerName: "",
            vehicleNumber: "",
            buyerName: "",
            data: [],
            filteredData: [],
            sortedData: [],
            sortField: "invoice_date",
            sortDirection: "desc",
            isProcessing: false,
            showDetailModal: false,
            showEditModal: false,
            selectedItem: null,
            isEditing: false,
            editForm: {
                vehicle_id: "",
                customer_name: "",
                registration_no: "",
                destination: "",
                buyer_name: "",
                buyer_contact: "",
                status: "pending"
            }
        });
        this.loadData();
    }

    get data() {
        return this.state.data || [];
    }
    get filteredData() {
        return this.state.filteredData || [];
    }
    get sortedData() {
        return this.state.sortedData || [];
    }

    async loadData() {
        try {
            this.state.isProcessing = true;
            
            // 1. 기본 차량 데이터 로드
            const cancelResponse = await fetch('/autoloadsolution/cancel/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {},
                }),
            });
            
            if (!cancelResponse.ok) throw new Error(`HTTP error! status: ${cancelResponse.status}`);
            const cancelResult = await cancelResponse.json();
            if (cancelResult.error) throw new Error(cancelResult.error.data.message || cancelResult.error.message);
            
            // 2. 선적 데이터 로드
            const shippingResponse = await fetch('/autoloadsolution/shipping/customs/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {},
                }),
            });
            
            if (!shippingResponse.ok) throw new Error(`HTTP error! status: ${shippingResponse.status}`);
            const shippingResult = await shippingResponse.json();
            if (shippingResult.error) throw new Error(shippingResult.error.data.message || shippingResult.error.message);
            
            // 3. 선적 신청 데이터 로드
            const applicationResponse = await fetch('/autoloadsolution/shipping/application/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {},
                }),
            });
            
            if (!applicationResponse.ok) throw new Error(`HTTP error! status: ${applicationResponse.status}`);
            const applicationResult = await applicationResponse.json();
            if (applicationResult.error) throw new Error(applicationResult.error.data.message || applicationResult.error.message);
            
            // 4. vehicle_id를 기반으로 데이터 조합
            const shippingDataMap = {};
            (shippingResult.result || []).forEach(item => {
                shippingDataMap[item.vehicle_id] = item;
            });
            
            const applicationDataMap = {};
            (applicationResult.result || []).forEach(item => {
                applicationDataMap[item.vehicle_id] = item;
            });
            
            // 5. 기본 데이터와 선적 데이터, 신청 데이터 조합
            this.state.data = (cancelResult.result || []).map(item => {
                const shippingInfo = shippingDataMap[item.vehicle_id] || {};
                const applicationInfo = applicationDataMap[item.vehicle_id] || {};
                return {
                    ...item,
                    // 선적 데이터에서 가져온 정보
                    destination: shippingInfo.destination || '',
                    invoice_date: shippingInfo.invoice_date || '',
                    cbm: shippingInfo.cbm || '',
                    // 선적 신청 데이터에서 가져온 정보
                    buyer_name: applicationInfo.buyer_name || '',
                    buyer_contact: applicationInfo.buyer_contact || '',
                };
            });
            
            this.state.filteredData = [...this.state.data];
            this.state.sortedData = [...this.state.data];
            
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            this.state.data = [];
            this.state.filteredData = [];
            this.state.sortedData = [];
        } finally {
            this.state.isProcessing = false;
        }
    }

    handleInputChange(field, value) {
        this.state[field] = value;
        this.applyFilters();
    }
    applyFilters() {
        let filtered = [...(this.state.data || [])];
        if (this.state.status) filtered = filtered.filter(item => item.status === this.state.status);
        if (this.state.ownerName) {
            const v = this.state.ownerName.toLowerCase();
            filtered = filtered.filter(item => item.owner_name?.toLowerCase().includes(v));
        }
        if (this.state.vehicleNumber) {
            const v = this.state.vehicleNumber.toLowerCase();
            filtered = filtered.filter(item => item.registration_no?.toLowerCase().includes(v));
        }
        if (this.state.buyerName) {
            const v = this.state.buyerName.toLowerCase();
            filtered = filtered.filter(item => item.buyer_name?.toLowerCase().includes(v));
        }
        if (this.state.dateFrom) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.invoice_date);
                const fromDate = new Date(this.state.dateFrom);
                return itemDate >= fromDate;
            });
        }
        if (this.state.dateTo) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.invoice_date);
                const toDate = new Date(this.state.dateTo);
                return itemDate <= toDate;
            });
        }
        this.state.filteredData = filtered;
        this.applySorting();
    }
    applySorting() {
        const sorted = [...(this.state.filteredData || [])];
        sorted.sort((a, b) => {
            let aValue = a[this.state.sortField];
            let bValue = b[this.state.sortField];
            if (this.state.sortField === 'invoice_date') {
                aValue = new Date(aValue || 0);
                bValue = new Date(bValue || 0);
            }
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            if (aValue < bValue) return this.state.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        this.state.sortedData = sorted;
    }
    handleSort(field) {
        if (this.state.sortField === field) {
            this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortField = field;
            this.state.sortDirection = 'asc';
        }
        this.applySorting();
    }
    handleReset() {
        this.state.dateFrom = "";
        this.state.dateTo = "";
        this.state.status = "";
        this.state.ownerName = "";
        this.state.vehicleNumber = "";
        this.state.buyerName = "";
        this.applyFilters();
    }
    handleViewDetail(item) {
        this.state.selectedItem = item;
        this.state.showDetailModal = true;
    }
    handleEdit(item) {
        this.state.isEditing = true;
        // 고객명은 기존 데이터로 채우고, 목적지, 구매자이름, 구매자연락처만 수정 가능
        this.state.editForm = {
            id: item.id,
            vehicle_id: item.vehicle_id || '',
            customer_name: item.owner_name || '', // 기존 소유주명으로 채움
            registration_no: item.registration_no || '',
            destination: item.destination || '',
            buyer_name: item.buyer_name || '',
            buyer_contact: item.buyer_contact || '',
            invoice_date: item.invoice_date || new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로
            status: item.status || 'pending',
            // 수정 가능한 필드 플래그 (목적지, 구매자이름, 구매자연락처만)
            editableFields: {
                vehicle_id: false, // 수정 불가
                customer_name: false, // 수정 불가 (기존 데이터)
                registration_no: false, // 수정 불가
                destination: true, // 수정 가능
                buyer_name: true, // 수정 가능
                buyer_contact: true // 수정 가능
            }
        };
        this.state.showEditModal = true;
    }
    handleEditFromModal() {
        this.state.showDetailModal = false;
        this.handleEdit(this.state.selectedItem);
    }
    handleAddNew() {
        this.state.isEditing = false;
        this.state.editForm = {
            vehicle_id: '',
            customer_name: '',
            registration_no: '',
            destination: '',
            buyer_name: '',
            buyer_contact: '',
            invoice_date: new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로
            status: 'pending'
        };
        this.state.showEditModal = true;
    }
    handleEditFormChange(field, value) {
        this.state.editForm[field] = value;
    }
    async handleSave() {
        try {
            this.state.isProcessing = true;
            
            // 1. 선적통관 API 요청 데이터 준비
            const customsRequestData = {
                jsonrpc: "2.0",
                params: {
                    vehicle_id: this.state.editForm.vehicle_id,
                    destination: this.state.editForm.destination,
                    invoice_date: this.state.editForm.invoice_date || new Date().toISOString().split('T')[0] // 오늘 날짜를 기본값으로
                }
            };

            // 2. 선적신청 API 요청 데이터 준비
            const applicationRequestData = {
                jsonrpc: "2.0",
                params: {
                    vehicle_id: this.state.editForm.vehicle_id,
                    buyer_name: this.state.editForm.buyer_name,
                    buyer_contact: this.state.editForm.buyer_contact
                }
            };

            // 3. 선적통관 API 호출
            const customsResponse = await fetch('/autoloadsolution/shipping/customs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(customsRequestData),
            });

            if (!customsResponse.ok) {
                throw new Error(`선적통관 API HTTP error! status: ${customsResponse.status}`);
            }

            const customsResult = await customsResponse.json();
            if (customsResult.error) {
                throw new Error(customsResult.error.data?.message || customsResult.error.message || '선적통관 저장 중 오류가 발생했습니다.');
            }

            // 4. 선적신청 API 호출
            const applicationResponse = await fetch('/autoloadsolution/shipping/application/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(applicationRequestData),
            });

            if (!applicationResponse.ok) {
                throw new Error(`선적신청 API HTTP error! status: ${applicationResponse.status}`);
            }

            const applicationResult = await applicationResponse.json();
            if (applicationResult.error) {
                throw new Error(applicationResult.error.data?.message || applicationResult.error.message || '선적신청 저장 중 오류가 발생했습니다.');
            }

            // 성공 메시지 표시
            alert('선적 정보가 성공적으로 저장되었습니다.');
            
            // 모달 닫기 및 데이터 새로고침
            this.state.showEditModal = false;
            await this.loadData(); // 데이터 새로고침
            
        } catch (error) {
            console.error('저장 실패:', error);
            alert('저장 중 오류가 발생했습니다: ' + error.message);
        } finally {
            this.state.isProcessing = false;
        }
    }
    async handleDelete(item) {
        // 실제 삭제 로직은 생략 (API 연동 필요)
        this.applyFilters();
    }

    // 버튼 비활성화 여부를 확인하는 메서드
    isButtonDisabled(item) {
        // 필수 필드들이 비어있는지 확인
        const hasEmptyFields = !item.vehicle_id || !item.registration_no || 
                              !item.destination || !item.buyer_name || !item.buyer_contact;
        
        // isChecked가 false인지 확인 (API에서 제공하는 경우)
        const isNotChecked = item.isChecked === false;
        
        return hasEmptyFields || isNotChecked;
    }

    async handleIssueCustomsInvoice(item) {
        if (!item || !item.vehicle_id) {
            alert("차대번호가 없는 항목은 인보이스를 발급할 수 없습니다.");
            return;
        }
        
        try {
            this.state.isProcessing = true;
            
            // PDF 발급을 위한 데이터 준비
            const payload = {
                form_type: "roro",  // 선적통관 템플릿
                data: {
                    applicantName: item.owner_name || "머징",
                    applicantAddress: item.address || "인천광역시 미추홀구 인하로 100",
                    applicantContact: item.phone_number || "+82-10-1234-5678",
                    puchaserName: item.owner_name || "머징",
                    pushaserContact: item.phone_number || "+82-10-1234-5678",
                    destination: item.destination || "China",
                    buyerName: item.buyer_name || "Woochan",
                    vehicleName: "SONATA", // 기본값 또는 실제 차량명
                    vehicleYear: "2015", // 기본값 또는 실제 연도
                    vehicleId: item.vehicle_id,
                    quantity: "1",
                    unitPrice: "7,165,000", // 기본값 또는 실제 가격
                    salesAmount: "7,165,000", // 기본값 또는 실제 총액
                    vehicleWeight: "1,800", // 기본값 또는 실제 중량
                    invoiceDate: item.invoice_date || new Date().toISOString().split('T')[0]
                }
            };
            
            // PDF 생성 API 호출
            const response = await fetch('http://localhost:8000/pdf/fill_form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error(`PDF 생성 실패: ${response.status}`);
            }
            
            // PDF 다운로드
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `선적통관_인보이스_${item.vehicle_id}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            alert("선적통관 인보이스 PDF가 다운로드되었습니다.");
            
        } catch (error) {
            console.error("PDF 발급 실패:", error);
            alert("PDF 발급 중 오류가 발생했습니다: " + error.message);
        } finally {
            this.state.isProcessing = false;
        }
    }

    async handleIssueShippingInvoice(item) {
        if (!item || !item.vehicle_id) {
            alert("차대번호가 없는 항목은 인보이스를 발급할 수 없습니다.");
            return;
        }
        
        try {
            this.state.isProcessing = true;
            
            // PDF 발급을 위한 데이터 준비
            const payload = {
                form_type: "shipment",  // 선적신청 템플릿
                data: {
                    applicantName: item.owner_name || "머징",
                    applicantAddress: item.address || "인천광역시 미추홀구 인하로 100",
                    applicantContact: item.phone_number || "+82-10-1234-5678",
                    puchaserName: item.owner_name || "머징",
                    pushaserContact: item.phone_number || "+82-10-1234-5678",
                    destination: item.destination || "China",
                    buyerName: item.buyer_name || "Woochan",
                    vehicleName: "SONATA", // 기본값 또는 실제 차량명
                    vehicleYear: "2015", // 기본값 또는 실제 연도
                    vehicleId: item.vehicle_id,
                    quantity: "1",
                    unitPrice: "7,165,000", // 기본값 또는 실제 가격
                    salesAmount: "7,165,000", // 기본값 또는 실제 총액
                    vehicleWeight: "1,800", // 기본값 또는 실제 중량
                    invoiceDate: item.invoice_date || new Date().toISOString().split('T')[0]
                }
            };
            
            // PDF 생성 API 호출
            const response = await fetch('http://localhost:8000/pdf/fill_form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error(`PDF 생성 실패: ${response.status}`);
            }
            
            // PDF 다운로드
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `선적신청_인보이스_${item.vehicle_id}_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            alert("선적신청 인보이스 PDF가 다운로드되었습니다.");
            
        } catch (error) {
            console.error("PDF 발급 실패:", error);
            alert("PDF 발급 중 오류가 발생했습니다: " + error.message);
        } finally {
            this.state.isProcessing = false;
        }
    }
}
registry.category("actions").add("AutoloadSolution.shipping_manage", ShippingManage);
export default ShippingManage; 