/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

class CancelManage extends Component {
  static template = "AutoloadSolution.Page02CancelManage";

  setup() {
    this.state = useState({
      dateFrom: "",
      dateTo: "",
      status: "",
      ownerName: "",
      vehicleId: "",
      registrationNo: "",
      data: [],
      filteredData: [],
      sortedData: [],
      sortField: "date",
      sortDirection: "desc",
      isProcessing: false,
    });

    // 컴포넌트 마운트 시 데이터 로드
    this.loadData();
  }

  // XML에서 사용할 getter들
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

      // API 호출
      const response = await fetch("/autoloadsolution/cancel/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.data.message || result.error.message);
      }

      this.state.data = result.result || [];
      this.state.filteredData = [...this.state.data];
      this.state.sortedData = [...this.state.data];
    } catch (error) {
      console.error("데이터 로드 실패:", error);
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

    // 상태 필터
    if (this.state.status) {
      filtered = filtered.filter((item) => item.status === this.state.status);
    }

    // 소유자명 필터
    if (this.state.ownerName) {
      const ownerName = this.state.ownerName.toLowerCase();
      filtered = filtered.filter((item) =>
        item.owner_name?.toLowerCase().includes(ownerName)
      );
    }

    // 차대번호 필터
    if (this.state.vehicleId) {
      const vehicleId = this.state.vehicleId.toLowerCase();
      filtered = filtered.filter((item) =>
        item.vehicle_id?.toLowerCase().includes(vehicleId)
      );
    }

    // 자동차등록번호 필터
    if (this.state.registrationNo) {
      const registrationNo = this.state.registrationNo.toLowerCase();
      filtered = filtered.filter((item) =>
        item.registration_no?.toLowerCase().includes(registrationNo)
      );
    }

    // 날짜 필터 (현재 API에는 날짜 필드가 없으므로 주석 처리)
    // if (this.state.dateFrom) {
    //     filtered = filtered.filter(item => {
    //         const itemDate = new Date(item.created_at || item.date);
    //         const fromDate = new Date(this.state.dateFrom);
    //         return itemDate >= fromDate;
    //     });
    // }

    // if (this.state.dateTo) {
    //     filtered = filtered.filter(item => {
    //         const itemDate = new Date(item.created_at || item.date);
    //         const toDate = new Date(this.state.dateTo);
    //         return itemDate <= toDate;
    //     });
    // }

    this.state.filteredData = filtered;
    this.applySorting();
  }

  applySorting() {
    const sorted = [...(this.state.filteredData || [])];

    sorted.sort((a, b) => {
      let aValue = a[this.state.sortField];
      let bValue = b[this.state.sortField];

      // 날짜 정렬
      if (
        this.state.sortField === "date" ||
        this.state.sortField === "created_at"
      ) {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // 문자열 정렬
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return this.state.sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.state.sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    this.state.sortedData = sorted;
  }

  handleSort(field) {
    if (this.state.sortField === field) {
      this.state.sortDirection =
        this.state.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.state.sortField = field;
      this.state.sortDirection = "asc";
    }
    this.applySorting();
  }

  handleReset() {
    this.state.dateFrom = "";
    this.state.dateTo = "";
    this.state.status = "";
    this.state.ownerName = "";
    this.state.vehicleId = "";
    this.state.registrationNo = "";
    this.applyFilters();
  }

  async handleIssueInvoice(item) {
    try {
      this.state.isProcessing = true;

      // 1. vehicleinfo 데이터 가져오기
      const vehicleResponse = await fetch(
        "/autoloadsolution/vehicleinfo/list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params: {},
          }),
        }
      );

      if (!vehicleResponse.ok) {
        throw new Error(
          `Vehicle info HTTP error! status: ${vehicleResponse.status}`
        );
      }

      const vehicleResult = await vehicleResponse.json();

      if (vehicleResult.error) {
        throw new Error(
          vehicleResult.error.data.message || vehicleResult.error.message
        );
      }

      // 2. vehicle_id와 일치하는 데이터 찾기
      const vehicleInfo = vehicleResult.result.find(
        (v) => v.vehicle_id === item.vehicle_id
      );

      if (!vehicleInfo) {
        alert("해당 차량의 정보를 찾을 수 없습니다.");
        return;
      }

      // 3. 오늘 날짜 가져오기
      const today = new Date().toISOString().split("T")[0];

      // 4. PDF 요청 데이터 준비
      const pdfData = {
        form_type: "deregistration",
        data: {
          applicantName: "머징",
          applicantAddress: "인천광역시 미추홀구 인하로 100",
          applicantContact: "+82-10-1234-5678",
          puchaserName: "Moong",
          pushaserContact: "+86-123-3456-7890",
          destination: "China",
          vehicleName: vehicleInfo.vehicle_name,
          vehicleYear: vehicleInfo.vehicle_year.toString(),
          vehicleId: vehicleInfo.vehicle_id,
          quantity: "1",
          unitPrice: vehicleInfo.unit_price.toLocaleString(),
          salesAmount: vehicleInfo.sales_amount.toLocaleString(),
          vehicleWeight: vehicleInfo.vehicle_weight.toLocaleString(),
          invoiceDate: today,
        },
      };

      // 5. PDF 생성 요청
      const pdfResponse = await fetch("http://localhost:8000/pdf/fill_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      });

      if (!pdfResponse.ok) {
        throw new Error(
          `PDF generation HTTP error! status: ${pdfResponse.status}`
        );
      }

      // 6. PDF 다운로드
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${item.vehicle_id}_${today}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("인보이스가 성공적으로 생성되었습니다.");

      // 7. DB에서 isChecked = true로 변경
      await fetch("/autoloadsolution/cancel/mark_checked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "call",
          params: { vehicle_id: item.vehicle_id },
        }),
      });

      // 8. 화면의 상태도 즉시 업데이트
      item.status = "발급 완료";
    } catch (error) {
      console.error("인보이스 생성 실패:", error);
      alert("인보이스 생성 중 오류가 발생했습니다: " + error.message);
    } finally {
      this.state.isProcessing = false;
    }
  }

  handleStatusChange(id, newStatus) {
    // 상태 변경 로직 (필요시 구현)
    console.log(`상태 변경: ${id} -> ${newStatus}`);
    alert(`상태가 ${newStatus}로 변경되었습니다.`);
  }

  handleDeleteItem(id) {
    if (confirm("정말로 이 항목을 삭제하시겠습니까?")) {
      // 삭제 로직 (필요시 구현)
      console.log(`삭제: ${id}`);
      alert("항목이 삭제되었습니다.");
    }
  }

  debugLocalStorage() {
    const data = localStorage.getItem("cancelData");
    console.log("로컬 스토리지 데이터:", data);
    alert("콘솔에서 로컬 스토리지 데이터를 확인하세요.");
  }
}

registry
  .category("actions")
  .add("AutoloadSolution.cancel_manage", CancelManage);
