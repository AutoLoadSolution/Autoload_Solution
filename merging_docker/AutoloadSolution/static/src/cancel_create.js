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
            residentNumber: "",
        });
    }

    handleInputChange(field, value) {
        this.state[field] = value;
    }

    handleSubmit(ev) {
        ev.preventDefault();
        console.log("말소 데이터:", this.state);
        alert("말소 정보가 저장되었습니다.");
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
        this.state.residentNumber = "";
    }
}

registry.category("actions").add("AutoloadSolution.cancel_create", CancelCreate); 